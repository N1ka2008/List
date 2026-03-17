
const button = document.querySelector("#Add")
const text = document.querySelector("#text");
const taskInput = document.querySelector("#taskInput");
const themeBtn = document.getElementById("themeToggle");
const dateInput = document.querySelector("#dateInput");

// --- Funkce pro uložení úkolů do localStorage ---
function ulozUkoly() {
    const ulozeneUkoly = [];
    text.querySelectorAll("li").forEach(li => {
        ulozeneUkoly.push({
            text: li.querySelector("span").textContent.trim(),
            done: li.querySelector("input[type='checkbox']").checked,
            date: li.querySelector(".task-date").dataset.date
        });
    });
    localStorage.setItem("todoZaloha", JSON.stringify(ulozeneUkoly));
}

// --- Funkce pro vytvoření úkolu v DOM ---
function vytvorUkol(value, date, done = false) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;

    const textSpan = document.createElement("span");
    textSpan.textContent = " " + value + " ";
    textSpan.classList.add("task-text");

    const button1 = document.createElement("button");
    button1.type = "button";
    const img1 = document.createElement("img");
    img1.src = "https://logowik.com/content/uploads/images/888_edit.jpg";
    img1.alt = "edit";
    img1.width = 20;
    img1.height = 15;
    button1.appendChild(img1);

    const button2 = document.createElement("button");
    button2.type = "button";
    button2.classList.add("delete-btn");
    const img2 = document.createElement("img");
    img2.src = "https://i.fbcd.co/products/original/de18ae7d25cea00a569f391100ae56d990105791a99a2d42f35d84477a869d68.jpg";
    img2.alt = "delete";
    img2.width = 20;
    img2.height = 15;
    button2.appendChild(img2);

    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    dateSpan.dataset.date = date;
    dateSpan.textContent = date ? " (do: " + date + ")" : "";

    if (date) {
        const today = new Date();
        const due = new Date(date);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
            dateSpan.classList.add("overdue");
        }
    }

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(button1);
    li.appendChild(button2);

    text.appendChild(li);


    // --- Eventy ---
    checkbox.addEventListener("change", function () {

        li.classList.add("jump");

        setTimeout(() => {

            if (checkbox.checked) {
                li.classList.add("completed");
            } else {
                li.classList.remove("completed");
            }

            li.classList.remove("jump");
            ulozUkoly();

        }, 400);
    });

    button2.onclick = function () {
        li.remove();
        ulozUkoly();
    }

    button1.onclick = function () {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = textSpan.textContent.trim();

        li.replaceChild(editInput, textSpan);
        editInput.focus();

        editInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") saveEdit();
        });

        editInput.addEventListener("blur", saveEdit);

        function saveEdit() {
            textSpan.textContent = " " + editInput.value.trim() + " ";
            li.replaceChild(textSpan, editInput);
            ulozUkoly();
        }
    }
}

// --- Přidání nového úkolu ---
button.onclick = function () {
    const value = taskInput.value.trim();
    const date = dateInput.value;

    if (value === "") return;
    vytvorUkol(value, date);
    taskInput.value = "";
    dateInput.value = "";
    ulozUkoly();

}

// --- Načtení zálohy při startu ---
window.addEventListener("load", () => {
    const ulozene = localStorage.getItem("todoZaloha");
    if (ulozene) {
        const nacist = confirm("Našla se záloha úkolů. Chceš ji načíst?");
        if (nacist) {
            const ulozeneUkoly = JSON.parse(ulozene);
            ulozeneUkoly.forEach(u => vytvorUkol(u.text, u.date, u.done));
        }
    }
});
//prepinani modu
themeBtn.onclick = function(){
    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){
        localStorage.setItem("theme","light");
    }else{
        localStorage.setItem("theme","dark");
    }
}

// načtení módu při startu
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light"){
        document.body.classList.add("light-mode");
    }
});


