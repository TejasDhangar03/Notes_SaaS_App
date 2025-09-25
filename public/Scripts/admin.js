registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const tenant_id = document.getElementById("tenant_id").value;
    const roles = document.getElementsByName("role");
    let role

    if (!email || !password || !tenant_id || !roles) {
        alert("Please fill all the fields!");
        return;
    }

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].checked) {
            role = roles[i].value;
            break;
        }
    }
    // console.log({ email, password, tenant_id, role });

    const res = await fetch("/admin/invite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, tenant_id, role })
    });

    if (res.status !== 201) {
        alert("Invite Failed");
        return;
    }
    else {
        alert("Invited Successful");
        const data = await res.json();
        console.log(data);
        window.location.href = "/";
    }
});

refresh.addEventListener("click", async (e) => {
    alert("refreshed");
    const res = await fetch("/admin/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });

    const data = await res.json();
    console.log(data);

    let userslist = document.querySelector(".userslist");
    userslist.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        const userdata = data[i];
        if (data[i].plan === "free") {
            userslist.innerHTML += `
                                <div class="user">
                                    <div>${data[i].email}</div>
                                        <div>
                                            <button class="update" data-id="${data[i]._id}">Upgrade</button>
                                        </div>
                                </div>`;
        } else {
            userslist.innerHTML += `
                                <div class="user">
                                    <div>${data[i].email}</div>
                                        <div>
                                            <div>Plan Pro</div>
                                        </div>
                                </div>`;
        }
    }
    Array.from(document.querySelectorAll(".update")).forEach((button, index) => {
        button.addEventListener("click", async () => {
            const userId = button.dataset.id;
            // console.log("update user with ID:", userId);
            const res = await fetch("/admin/premium:", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: userId }),
                credentials: 'include'
            });

            if (res.status !== 200) {
                alert("Update Failed");
                return;
            }

            const data = await res.json();
            console.log(data);

            alert("Membership Updated Successfully");
            main();
            window.location.reload();
        });
    });
});

window.onload = async () => {

    const res = await fetch("/admin/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });

    const data = await res.json();
    console.log(data);

    let userslist = document.querySelector(".userslist");
    userslist.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const userdata = data[i];
        if (data[i].plan === "free") {
            userslist.innerHTML += `
                                <div class="user">
                                    <div>${data[i].email}</div>
                                        <div>
                                            <button class="update" data-id="${data[i]._id}">Upgrade</button>
                                        </div>
                                </div>`;
        } else {
            userslist.innerHTML += `
                                <div class="user">
                                    <div>${data[i].email}</div>
                                        <div>
                                            <div>Plan Pro</div>
                                        </div>
                                </div>`;
        }
    }

    Array.from(document.querySelectorAll(".update")).forEach((button, index) => {
        button.addEventListener("click", async () => {

            const userId = button.dataset.id;
            // console.log("update user with ID:", userId);

            const res = await fetch(`/admin/premium/id=${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: userId }),
                credentials: 'include'
            });

            if (res.status !== 200) {
                alert("Update Failed");
                return;
            }

            const data = await res.json();
            console.log(data);

            alert("Membership Updated Successfully");
            main();
            window.location.reload();
        });
    });
}

logout.addEventListener("click", async () => {

    const res = await fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });

    if (res.status != 200) {
        alert("Logout Failed");
        return;
    }

    alert("Logged out Successfully");
    localStorage.clear();
    window.location.href = "/login";
});

function main() {
    const plan = localStorage.getItem("plan");
    const count = localStorage.getItem("count");
    const email = localStorage.getItem("email");

    document.querySelector(".greet").innerText = "Welcome " + email;
    document.querySelector(".pln").innerText = "Plan : " + plan;

    if (plan != "pro") {
        document.querySelector(".remaining").innerText = (count) + " Notes left";
    }
}

main();
