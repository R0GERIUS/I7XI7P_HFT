let armors = [];
let jobs = [];
let weapons = [];
let connection = null;

getdata();
setupSignalR();

function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:30703/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ArmorCreated", (user, message) => {
        getdata();
    });

    connection.on("ArmorDeleted", (user, message) => {
        getdata();
    });

    connection.onclose(async () => {
        await start();
    });
    start();


}

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function getdata() {
    await fetch('http://localhost:30703/armor')
        .then(x => x.json())
        .then(y => {
            armors = y;
            display();
        });
}

function display() {
    document.getElementById('resultarea').innerHTML = "";
    armors.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.armorName + "</td><td>"
            + t.armorDefense + "</td><td>" +
            `<button type="button" onclick="remove(${t.armorId})">Delete</button>`
            + "</td></tr>";
    });
}

function remove(id) {
    fetch('http://localhost:30703/armor/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getdata();
        })
        .catch((error) => { console.error('Error:', error); });

}

function create() {
    let name = document.getElementById('actorname').value;
    fetch('http://localhost:30703/armor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { actorName: name })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getdata();
        })
        .catch((error) => { console.error('Error:', error); });

}