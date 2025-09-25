registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cnfpassword = document.getElementById("cnfpassword").value;
    const tenant_id = document.getElementById("tenant_id").value;
    const roles = document.getElementsByName("role");
    let role

    if (!email || !password || !cnfpassword || !tenant_id || !roles) {
        alert("Please fill all the fields!");
        return;
    }

    if (password !== cnfpassword) {
        alert("Password and Confirm Password do not match!");
        return;
    }

    for(let i = 0; i < roles.length; i++) {
        if (roles[i].checked) {
            role = roles[i].value;
            break;
        }
    }
    console.log({ email, password, tenant_id, role });

    const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, tenant_id, role })
    });

    if (res.status !== 201) {
        alert("Registration Failed");
        return;
    }
    else {
        alert("Registration Successful");
        const data = await res.json();
        console.log(data);
        window.location.href = "/";
    }


});