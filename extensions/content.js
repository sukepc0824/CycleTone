base_list = []
code_list = []
setTimeout(() => {
    document.querySelector("#C_button").click()
}, 2000);
setTimeout(() => {
    document.querySelectorAll("table tr").forEach(element => {
        if (element.id.includes("row_")) {
            base_list.push([]);
            element.querySelectorAll("td img").forEach(child_element => {
                let code = child_element.src.slice(32, -4)
                if (code.includes("N")) {
                    return false;
                }
                code = code.replace("%E2%99%AF", "#")
                code = code.replace("%E2%99%AF", "#")
                code = code.replace("%E2%99%AF", "#")
                base_list[base_list.length - 1].push(code)
            })
        }
    })
    base_list.forEach(element => {
        if (element.length >= 3) {
            code_list.push(element)
        }
    })
    console.log(JSON.stringify(code_list).slice(1, -1))
    setTimeout(() => navigator.clipboard.writeText(JSON.stringify(code_list).slice(1, -1)+","), 500);  // 500ms遅らせて実行

}, 4000);