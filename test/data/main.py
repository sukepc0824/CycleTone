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

with open(csv_file_path, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    rows = list(reader)

for m_col, g_col in columns_to_compare:
    m_values = [float(row[m_col]) for row in rows]
    g_values = [float(row[g_col]) for row in rows]

    print(wilcoxon(m_values, g_values))