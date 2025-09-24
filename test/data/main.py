import csv
from scipy.stats import wilcoxon

# CSVファイルのパス
csv_file_path = '/Users/pcsuke/chord-model/test/data/instrument.csv'

# 比較する列名のペア
columns_to_compare = [
    ("直観性(m)", "直観性(g)"),
    ("楽しさ(m)", "楽しさ(g)"),
    ("意図(m)", "意図(g)"),
    ("音楽理論(m)", "音楽理論(g)"),
    ("操作不満(m)", "操作不満(g)")
]

# CSVファイルを読み込む
with open(csv_file_path, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    rows = list(reader)  # 全行をリストとして保持

# 各列ペアについてウィルコクソン検定を実施
for m_col, g_col in columns_to_compare:
    m_values = [float(row[m_col]) for row in rows]
    g_values = [float(row[g_col]) for row in rows]

    # ウィルコクソンの符号付き順位検定
    stat, p_value = wilcoxon(m_values, g_values)

    # 結果を表示
    print(f"列ペア: {m_col} vs {g_col}")
    print(f"統計量: {stat}")
    print(f"p値: {p_value}")

    if p_value < 0.05:
        print("有意差があります (p < 0.05)")
    else:
        print("有意差はありません (p >= 0.05)")
    print("-" * 40)
