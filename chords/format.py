import json
base_data = []
with open('data.json') as f:
    base_data = json.load(f)

formated_data = []
for codes in base_data:
    l = []
    for code in codes:
        s = code
        if("on" in code):
            s = s.replace(s[s.find("on")::],"")
        if("st" in code):
            s = s.replace("st","")
        if("enter" in code or "no" in code):
            break
        l.append(s)
    if(not len(l)<=2):
        l.insert(0,"<s>") #先頭を指定
        l.append("<e>") 
        formated_data.append(l)
f = open('formated_data.json', 'a')
f.write(json.dumps(formated_data))
f.close()
print(len(formated_data))