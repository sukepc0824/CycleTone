from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time
import urllib.parse
import json

for id in range(6500, 7200):
    driver = webdriver.Chrome()
    driver.get(f"https://www.chord-rinne.jp/scode.php?id={id}")
    time.sleep(0.5)

    try:
        c_button = driver.find_element(By.ID, "C_button")
        c_button.click()
    except NoSuchElementException:
        print(f"[id={id}] C_button が見つかりません。スキップします。")
        driver.quit()
        continue

    time.sleep(1)

    base_list = []
    code_list = []

    rows = driver.find_elements(By.CSS_SELECTOR, "table tr")
    for row in rows:
        if "row_" in row.get_attribute("id"):
            codes = []
            images = row.find_elements(By.CSS_SELECTOR, "td img")
            for img in images:
                src = img.get_attribute("src")
                code = src[32:-4]
                if "N" not in code:
                    code = urllib.parse.unquote(code)
                    code = code.replace("\u266f", "#")
                    code = code.replace("♯", "#")
                    codes.append(code)

            base_list.append(codes)

    for codes in base_list:
        if len(codes) >= 2:
            code_list.append(codes)

    output = json.dumps(code_list)[1:-1]  # 角カッコを除く
    print(f"[id={id}] 抽出結果:")
    print(output)

    driver.quit()
    f = open('data.json', 'a')
    f.write(output+",")
    f.close()
