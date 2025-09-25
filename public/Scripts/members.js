function main() {
    const plan = localStorage.getItem("plan");
    const count = localStorage.getItem("count");
    const email = localStorage.getItem("email");

    document.querySelector(".greet").innerText = "Welcome " + email;
    document.querySelector(".pln").innerText = "Plan : " + plan;

    if (plan != "pro") {
        document.querySelector(".remaining").innerText =count+ " Notes left";
    }
}

main();

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

document.getElementById("create").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    console.log(title, content);
    if (!title || !content) {
        alert("Please fill all the fields");
        return;
    }
    const res = await fetch("/member/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include'
    });
    const data1 = await res.json();
    console.log(data1.data)
    if (res.status != 200) {
        alert(data1.message);
        return;
    }
    localStorage.setItem("count",data1.data)
    main()
    alert("Note Created Successfully");
    window.location.reload();
});

window.onload = async () => {
    main();
    const res = await fetch("/member/notes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });
    const data1 = await res.json();
    console.log(data1.data);
    if (res.status != 201) {
        alert(data1.message);
        return;
    }
    const notes = data1.notes;

    const container = document.querySelector(".allnote");

    for (let i = 0; i < data1.data.length; i++) {
        let data = data1.data[i];
        console.log(data._id);
        container.innerHTML += `
                            <div class="notee">
                            <h4 class="title title-${data._id}" data-id="${data._id}" contenteditable="true">${data.title}</h4>
                            <p class="content content-${data._id}" contenteditable="true" data-id="${data._id}">${data.content}</p>
                            <div class="buton">
                                <button data-id="${data._id}" class="delete" >Delete</button>
                                <button data-id="${data._id}" class="update update-${data._id}" disabled>Update</button>
                            </div>
                        </div>
        `

    }
    Array.from(document.querySelectorAll(".delete")).forEach((ele) => {
        ele.addEventListener("click", async (e) => {
            console.log(e.target.dataset.id)

            const res = await fetch("/member/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: e.target.dataset.id}),
                credentials: 'include'
            });
            const data1 = await res.json();
            console.log(data1.data);
            if (res.status != 201) {
                alert(data1.message);
                return;
            }
            alert("Deleted Successfull")
            window.location.reload()

        })
    })

    Array.from(document.querySelectorAll(".content")).forEach((ele) => {
        ele.addEventListener("input", async (e) => {
            enablebtn(e)
        })
    })
    Array.from(document.querySelectorAll(".title")).forEach((ele) => {
        ele.addEventListener("input", async (e) => {
            enablebtn(e)
        })
    })
    Array.from(document.querySelectorAll(".update")).forEach((ele) => {
        ele.addEventListener("click", async (e) => {
            update(e.target.dataset.id)
        })
    })
    
}
function enablebtn(e){
    const id=e.target.dataset.id;
    const btn=document.querySelector(`.update-${id}`);
    try{
        btn.disabled=false
    }catch(err){

    }
}

async function update(id){

    const title1=document.querySelector(`.title-${id}`).innerHTML
    const content=document.querySelector(`.content-${id}`).innerHTML

    try{
        const res = await fetch("/member/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id:id,title:title1,content:content}),
                credentials: 'include'
            });
            const data = await res.json();

            if (res.status != 201) {
                alert(data.message);
                return;
            }
            alert("Updated!!!!")
            document.querySelector(`.update-${id}`).disabled=true
            window.location.reload()

    }catch(err){
        console.log(err)
    }
}

