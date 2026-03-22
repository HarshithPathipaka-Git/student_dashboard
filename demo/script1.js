
let subjects = [];

let saved = localStorage.getItem("subjects");

if (saved) {
    subjects = JSON.parse(saved);
    displaySubjects();
}


function calculateAttendance(total, attended) {
    if (total === 0) return { percent: 0, message: "No classes yet" };

    let percent = (attended / total) * 100;
    percent = percent.toFixed(2);

    if (percent < 75) {
        let x = 0;
        while (((attended + x) / (total + x)) < 0.75) x++;
        return { percent, message: `Attend ${x} more classes` };
    } else {
        let x = 0;
        while ((attended / (total + x)) >= 0.75) x++;
        return { percent, message: `You can bunk ${x - 1} classes` };
    }
}

function addSubject() {
    let name = document.getElementById("subject").value;
    let total = parseInt(document.getElementById("total").value);
    let attended = parseInt(document.getElementById("attended").value);
    

    // ❌ Empty check
    if (!name || isNaN(total) || isNaN(attended)) {
        alert("Enter valid data");
        return;
    }

    // ❌ Negative check
    if (total <= 0 || attended < 0) {
        alert("Values cannot be negative or zero");
        return;
    }

    // ❌ Logical check
    if (attended > total) {
        alert("Attended cannot be greater than total classes");
        return;
    }

    subjects.push({ name, total, attended });
    displaySubjects();
    localStorage.setItem("subjects", JSON.stringify(subjects));

    // clear inputs after adding subject
    document.getElementById("subject").value = "";
    document.getElementById("total").value = "";
    document.getElementById("attended").value = "";
}

function displaySubjects() {
    let container = document.getElementById("subjectsList");
    container.innerHTML = "";

    let totalClasses = 0;
    let totalAttended = 0;

    subjects.forEach((sub, index) => {
        let result = calculateAttendance(sub.total, sub.attended);

        totalClasses += sub.total;
        totalAttended += sub.attended;

       container.innerHTML += `
            <div class="card">
                <h3>${sub.name}</h3>
                <p>${result.percent}%</p>
                <p>${result.message}</p>
                <button onclick="deleteSubject(${index})">Delete</button>
            </div>
        `;
    });

    let overallPercent = (totalAttended / totalClasses) * 100;

    document.getElementById("overall").innerHTML = `
        <div class="card">
            <h3>Overall</h3>
            <p>${overallPercent.toFixed(2)}%</p>
        </div>
    `;
}



function deleteSubject(index) {
    subjects.splice(index, 1);

    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();
}