import pandas as pd

# データ読み込み
import os

# Ensure the file exists
file_path = "/Users/pcsuke/chord-model/test/data/data.csv"
if not os.path.exists(file_path):
    raise FileNotFoundError(f"File '{file_path}' not found. Please check the path.")

df = pd.read_csv(file_path,
                 names=["id1", "id2", "emo", "inst", "val1", "val2"])

# fifth/midi を f/g に変換
df["suffix"] = df["inst"].map({"fifth":"f", "midi":"g"})
df["row_id"] = df["id1"].astype(str) + df["suffix"]

# 自然さのピボット
pivot_score = df.pivot_table(index="row_id", columns="id2", values="val1", aggfunc="first")

# テーマ合致のピボット
pivot_emo = df.pivot_table(index="row_id", columns="id2", values="val2", aggfunc="first")

# 列の MultiIndex にして結合
pivot_score.columns = pd.MultiIndex.from_product([pivot_score.columns, ["自然さ"]])
pivot_emo.columns = pd.MultiIndex.from_product([pivot_emo.columns, ["合致"]])

# 横結合 (全体で結合)
pivot_combined = pd.concat([pivot_score, pivot_emo], axis=1)

# CSVに出力
output_path = "/Users/pcsuke/chord-model/test/data/result.csv"
pivot_combined.to_csv(output_path)
