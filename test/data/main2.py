import pandas as pd
from scipy.stats import wilcoxon

# CSVファイルの読み込み
csv_file_path = '/Users/pcsuke/chord-model/test/data/result.csv'
data = pd.read_csv(csv_file_path, header=1)  # 2行目からヘッダーを読み込む

# f列とg列のペアを抽出
columns = data.columns
print(columns)
f_columns = [col for col in columns if col.endswith('f')]
g_columns = [col for col in columns if col.endswith('g')]

# 各ペアでウィルコクソン検定を実施
for f_col, g_col in zip(f_columns, g_columns):
    f_values = data[f_col].dropna()  # 欠損値を除外
    g_values = data[g_col].dropna()  # 欠損値を除外

    # ウィルコクソンの符号付き順位検定
    stat, p_value = wilcoxon(f_values, g_values)

    # 結果を表示
    print(f"列ペア: {f_col} vs {g_col}")
    print(f"統計量: {stat}")
    print(f"p値: {p_value}")

    if p_value < 0.05:
        print("有意差があります (p < 0.05)")
    else:
        print("有意差はありません (p >= 0.05)")
    print("-" * 40)