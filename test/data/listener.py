import pandas as pd
from scipy.stats import wilcoxon

df = pd.read_csv("/Users/pcsuke/chord-model/test/data/result.csv")

df["ID"] = df.iloc[:, 0].str[:-1]
df["group"] = df.iloc[:, 0].str[-1]

pivot = df.pivot(index="ID", columns="group")

results = {}
for col in df.columns[1:-2]:  # id,グループの除外
    g_values = pivot[col]["g"]
    m_values = pivot[col]["m"]
    stat, p = wilcoxon(g_values, m_values)
    results[col] = {"stat": stat, "p": p}

print(pd.DataFrame(results).T)
