loginBtn.addEventListener("click", async(e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    const res=await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }) ,
        credentials: 'include'  
    });

    if(res.status==201){
        const data=await res.json();
        console.log(data);

        localStorage.setItem("plan",data.plan);
        localStorage.setItem("count",data.count);
        localStorage.setItem("email",data.email);

        alert("Login Successful");
        window.location.href = "/"; 
    }else{
        alert("Login Failed");
    }
});
