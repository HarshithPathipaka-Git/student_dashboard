let subjects = [];
let regulation = "";
let mode = "";

// 🔵 Step 1: Regulation
function selectRegulation(type) {
    regulation = type;

    document.getElementById("intro").style.display = "none";
    document.getElementById("modeSection").style.display = "block";
}

// 🔵 Step 2: Mode
function selectMode(m) {
    mode = m;

    document.getElementById("modeSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    // Hide subject field if overall
    if (regulation === "overall") {
        document.getElementById("subjectField").style.display = "none";
    }

    // Show semester field if known mode
    if (mode === "known") {
        document.getElementById("totalSemField").style.display = "block";
    }

    displaySubjects();
}

// 🔵 Core logic
function calculateAttendance(total, attended) {
    let percent = (attended / total) * 100;
    percent = percent.toFixed(2);

    if (percent < 75) {
        let x = 0;
        while (((attended + x) / (total + x)) < 0.75) x++;
        if (x > 50) {
    return { percent, message: "⚠️ Very low attendance! Hard to recover 😬" };
} else {
    return { percent, message: `Attend ${x} more classes` };
}
    } else {
        let x = 0;
        while ((attended / (total + x)) >= 0.75) x++;
        let bunk = x - 1;
        if (bunk < 0) bunk = 0;
        return { percent, message: `You can bunk ${bunk} classes` };
    }
}

// 🔵 Future prediction
function futurePrediction(totalSem, held, attended) {
    let remaining = totalSem - held;

    // already safe
    if ((attended / held) >= 0.75) {
        return `You are safe. You can manage remaining ${remaining} classes`;
    }

    let x = 0;

    while (x <= remaining) {
        if ((attended + x) / (held + x) >= 0.75) {
            return `Out of ${remaining} classes, attend at least ${x}`;
        }
        x++;
    }

    // ❌ not possible case
    return `Even if you attend all ${remaining} classes, 75% is NOT possible`;
}

// 🔵 Add subject
function addSubject() {
    let name = regulation === "overall" ? "Overall" : document.getElementById("subject").value;
    let total = parseInt(document.getElementById("total").value);
    let attended = parseInt(document.getElementById("attended").value);
    let totalSem = parseInt(document.getElementById("totalSem").value);

    if (!name || isNaN(total) || isNaN(attended)) {
        alert("Enter valid data");
        return;
    }

    if (total <= 0 || attended < 0 || attended > total) {
        alert("Invalid values");
        return;
    }

    if (regulation === "overall") {
    subjects = [{ name, total, attended, totalSem }];
    } 
    else {
    subjects.push({ name, total, attended, totalSem });
    }

    if (mode === "known" && isNaN(totalSem)) {
    alert("Enter total semester classes");
    return;
}
    // localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();

    // clear inputs
    document.getElementById("subject").value = "";
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
    document.getElementById("totalSem").value = "";
}

// 🔵 Display
function displaySubjects() {
    let container = document.getElementById("subjectsList");
    container.innerHTML = "";

    let totalClasses = 0;
    let totalAttended = 0;

    subjects.forEach((sub, index) => {
        let result = calculateAttendance(sub.total, sub.attended);

        totalClasses += sub.total;
        totalAttended += sub.attended;

        let extra = "";

        if (mode === "known" && sub.totalSem) {
            extra = `<p>${futurePrediction(sub.totalSem, sub.total, sub.attended)}</p>`;
        }

        container.innerHTML += `
           <div class="card">
                <h3><i class="fa-solid fa-book"></i> ${sub.name}</h3>
                <p><i class="fa-solid fa-chart-line"></i> ${result.percent}%</p>
                <p><i class="fa-solid fa-circle-info"></i> ${result.message}</p>
                ${extra}
                <button onclick="deleteSubject(${index})">Delete</button>    
            </div>
        `;
    });

    let overallPercent = totalClasses === 0 ? 0 : (totalAttended / totalClasses) * 100;

    document.getElementById("overall").innerHTML = `
        <div class="card">
            <h3>Overall</h3>
            <p>${overallPercent.toFixed(2)}%</p>
        </div>
    `;
}

// 🔵 Delete
function deleteSubject(index) {
    subjects.splice(index, 1);
    // localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
}