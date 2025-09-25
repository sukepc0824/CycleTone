from collections import defaultdict
import data,json
def build_recursive_json(start_probs, model, depth_limit=10, threshold=0.01):
    def build_node(context, prob, depth):
        if prob < threshold or depth > depth_limit:
            return None

        node = {"value": round(prob, 4)}
        key = tuple(context)
        if key in model:
            next_dict = {}
            for next_chord, next_prob in model[key].items():
                if next_prob < threshold:
                    continue
                if next_chord == '<END>':
                    next_dict[next_chord] = {"value": round(next_prob, 4)}
                else:
                    child_node = build_node(context + [next_chord], next_prob, depth + 1)
                    if child_node:
                        next_dict[next_chord] = child_node
            if next_dict:
                node["next"] = next_dict
        return node

    result = {}
    for chord, prob in start_probs.items():
        if prob < threshold:
            continue
        node = build_node([chord], prob, 1)
        if node:
            result[chord] = node
    return result

class SequentialNGramChordPredictor:
    def __init__(self, max_n=5):
        self.max_n = max_n
        self.model = defaultdict(lambda: defaultdict(int))
        self.start_counts = defaultdict(int)

    def fit(self, chord_progressions):
        for progression in chord_progressions:
            if not progression or len(progression) <= 2:
                continue

            # 開始コードの記録
            self.start_counts[progression[0]] += 1

            # N-gram の学習（先頭から順番を守って）
            for n in range(1, self.max_n + 1):
                for i in range(len(progression) - n):
                    if i == 0:
                        key = tuple(progression[i:i + n])
                        next_chord = progression[i + n]
                        self.model[key][next_chord] += 1

        # 開始コードの確率に変換
        total_starts = sum(self.start_counts.values())
        self.start_probs = {
            chord: count / total_starts for chord, count in self.start_counts.items()
        }

        # モデルの確率に変換
        for key, nexts in self.model.items():
            total = sum(nexts.values())
            for chord in nexts:
                nexts[chord] /= total
        recursive_json = build_recursive_json(predictor.start_probs, predictor.model)
        with open("recursive_chords.json", "w") as f:
            json.dump(recursive_json, f, indent=2)

    def get_next_probabilities(self, chord_sequence):
        for n in range(self.max_n, 0, -1):
            if len(chord_sequence) >= n:
                key = tuple(chord_sequence[-n:])
                if key in self.model:
                    return key, self.model[key]
        return None, {}

with open('formated_data.json') as f:
    sample_data = json.load(f)
    

predictor = SequentialNGramChordPredictor(max_n=5)
predictor.fit(sample_data)

while True:
    user_input = input("\nコードを入力（開始候補:<s>、終了:'exit'").strip()
    if user_input.lower() == 'exit':
        break

    chord_sequence = user_input.split()
    key_used, next_probs = predictor.get_next_probabilities(chord_sequence)

    if not next_probs:
        print("  入力されたコードの順番で始まるデータが見つかりません。")
    else:
        print(f"\nキー: {list(key_used)} に続くコードの確率")
        for chord, prob in sorted(next_probs.items(), key=lambda x: -x[1]):
            if prob < 0.03:
                break
            print(f"  {' '.join(key_used)} -> {chord}: {prob:.2f}")