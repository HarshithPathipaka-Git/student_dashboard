function calculateAttendance(total, attended) {
    if (total === 0) {
        return {
            percent: 0,
            status: "No classes yet",
            message: "Start attending classes 😄"
        };
    }

    let percent = (attended / total) * 100;
    percent = percent.toFixed(2);

    let result = {
        percent: percent,
        status: "",
        message: ""
    };

    // Case 1: Below 75%
    if (percent < 75) {
        let x = 0;
        while (((attended + x) / (total + x)) < 0.75) {
            x++;
        }
        result.status = "LOW";
        result.message = `You need to attend ${x} more classes`;
    }

    // Case 2: Above or equal 75%
    else {
        let x = 0;
        while ((attended / (total + x)) >= 0.75) {
            x++;
        }
        x = x - 1; // last valid bunk
        result.status = "SAFE";
        result.message = `You can bunk ${x} classes`;
    }

    return result;
}


console.log(calculateAttendance(40, 28)); // below 75
console.log(calculateAttendance(40, 35)); // above 75
console.log(calculateAttendance(0, 0));   // edge case