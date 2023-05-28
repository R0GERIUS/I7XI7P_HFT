let armors = [];
let jobs = [];
let weapons = [];

let connection = null;

let armorIdToUpdate = -1;
let jobIdToUpdate = -1;
let weaponIdToUpdate = -1;

let mode = "armor";

switch (mode)
{
    case "armor":
        switchToArmor();
        break;
    case "job":
        switchToJob();
        break;
    case "weapon":
        switchToWeapon();
        break;
    default:
        switchToArmor();
        break;
}

setupSignalR();

function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:30703/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ArmorCreated", (user, message) => {
        armorGetData();
    });

    connection.on("ArmorDeleted", (user, message) => {
        armorGetData();
    });

    connection.on("ArmorUpdated", (user, message) => {
        armorGetData();
    });

    connection.on("JobCreated", (user, message) => {
        jobGetData();
    });

    connection.on("JobDeleted", (user, message) => {
        jobGetData();
    });

    connection.on("JobUpdated", (user, message) => {
        jobGetData();
    });

    connection.on("WeaponCreated", (user, message) => {
        weaponGetData();
    });

    connection.on("WeaponDeleted", (user, message) => {
        weaponGetData();
    });

    connection.on("WeaponUpdated", (user, message) => {
        weaponGetData();
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

// Menu

function switchToArmor() {
    mode = "armor";
    document.getElementById('updateformdiv').style.display = "none";
    document.getElementById("headerlabel").innerHTML = "Armor Catalog";
    document.getElementById("namelabel").innerHTML = "Armor Name";
    document.getElementById("valuelabel").innerHTML = "Armor Defense";
    document.getElementById("addbutton").textContent = "Add Armor";
    document.getElementById("addbutton").setAttribute("onclick", "armorCreate()");
    document.getElementById("updatenamelabel").innerHTML = "Armor Name";
    document.getElementById("updatevaluelabel").innerHTML = "Armor Defense";
    document.getElementById("updatebutton").textContent = "Update Armor";
    document.getElementById("updatebutton").setAttribute("onclick", "armorUpdate(armorIdToUpdate)");
    document.getElementById("valueth").innerHTML = "Defense";
    armorGetData();
}

function switchToJob() {
    mode = "job";
    document.getElementById('updateformdiv').style.display = "none";
    document.getElementById("headerlabel").innerHTML = "Job Catalog";
    document.getElementById("namelabel").innerHTML = "Job Name";
    document.getElementById("valuelabel").innerHTML = "Job Role";
    document.getElementById("addbutton").textContent = "Add Job";
    document.getElementById("addbutton").setAttribute("onclick", "jobCreate()");
    document.getElementById("updatenamelabel").innerHTML = "Job Name";
    document.getElementById("updatevaluelabel").innerHTML = "Job Defense";
    document.getElementById("updatebutton").textContent = "Update Job";
    document.getElementById("updatebutton").setAttribute("onclick", "jobUpdate(jobIdToUpdate)");
    document.getElementById("valueth").innerHTML = "Role";
    jobGetData();
}

function switchToWeapon() {
    mode = "weapon";
    document.getElementById('updateformdiv').style.display = "none";
    document.getElementById("headerlabel").innerHTML = "Weapon Catalog";
    document.getElementById("namelabel").innerHTML = "Weapon Name";
    document.getElementById("valuelabel").innerHTML = "Weapon Damage";
    document.getElementById("addbutton").textContent = "Add Weapon";
    document.getElementById("addbutton").setAttribute("onclick", "weaponCreate()");
    document.getElementById("updatenamelabel").innerHTML = "Weapon Name";
    document.getElementById("updatevaluelabel").innerHTML = "Weapon Damage";
    document.getElementById("updatebutton").textContent = "Update Weapon";
    document.getElementById("updatebutton").setAttribute("onclick", "weaponUpdate(weaponIdToUpdate)");
    document.getElementById("valueth").innerHTML = "Damage";
    weaponGetData();
}

// Armor

async function armorGetData() {
    await fetch('http://localhost:30703/armor')
        .then(x => x.json())
        .then(y => {
            armors = y;
            armorDisplay();
        });
}

function armorDisplay() {
    document.getElementById('resultarea').innerHTML = "";
    armors.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.id + "</td><td>"
            + t.name + "</td><td>"
            + t.baseDefense + "</td><td>" +
            `<button type="button" onclick="armorRemove(${t.id})">Delete</button>` +
            `<button type="button" onclick="armorShowUpdate(${t.id})">Update</button>`
            + "</td></tr>";
    });
}

function armorRemove(id) {
    fetch('http://localhost:30703/armor/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function armorShowUpdate(id) {
    document.getElementById("updatename").value = armors.find(t => t['id'] == id)['name'];
    document.getElementById("updatevalue").value = armors.find(t => t['id'] == id)['baseDefense'];
    document.getElementById('updateformdiv').style.display = "flex";
    armorIdToUpdate = id;
}

function armorCreate() {
    let name = document.getElementById('name').value;
    let value = document.getElementById('value').value;
    fetch('http://localhost:30703/armor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { name: name, baseDefense: value })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function armorUpdate() {
    let name = document.getElementById('updatename').value;
    let value = document.getElementById('updatevalue').value;
    fetch('http://localhost:30703/armor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { id: armorIdToUpdate, name: name, baseDefense: value})
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

// Job

async function jobGetData() {
    await fetch('http://localhost:30703/job')
        .then(x => x.json())
        .then(y => {
            jobs = y;
            jobDisplay();
        });
}

function jobDisplay() {
    document.getElementById('resultarea').innerHTML = "";
    jobs.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.id + "</td><td>"
            + t.name + "</td><td>"
            + t.role + "</td><td>" +
            `<button type="button" onclick="jobRemove(${t.id})">Delete</button>` +
            `<button type="button" onclick="jobShowUpdate(${t.id})">Update</button>`
            + "</td></tr>";
    });
}

function jobRemove(id) {
    fetch('http://localhost:30703/job/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            jobGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function jobShowUpdate(id) {
    document.getElementById("updatename").value = jobs.find(t => t['id'] == id)['name'];
    document.getElementById("updatevalue").value = jobs.find(t => t['id'] == id)['role'];
    document.getElementById('updateformdiv').style.display = "flex";
    jobIdToUpdate = id;
}

function jobCreate() {
    let name = document.getElementById('name').value;
    let value = document.getElementById('value').value;
    fetch('http://localhost:30703/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { name: name, role: value })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            jobGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function jobUpdate() {
    let name = document.getElementById('updatename').value;
    let value = document.getElementById('updatevalue').value;
    fetch('http://localhost:30703/job', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { id: jobIdToUpdate, name: name, role: value })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            jobGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

// Weapon

async function weaponGetData() {
    await fetch('http://localhost:30703/weapon')
        .then(x => x.json())
        .then(y => {
            weapons = y;
            weaponDisplay();
        });
}

function weaponDisplay() {
    document.getElementById('resultarea').innerHTML = "";
    weapons.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.id + "</td><td>"
            + t.name + "</td><td>"
            + t.baseDamage + "</td><td>" +
            `<button type="button" onclick="weaponRemove(${t.id})">Delete</button>` +
            `<button type="button" onclick="weaponShowUpdate(${t.id})">Update</button>`
            + "</td></tr>";
    });
}

function weaponRemove(id) {
    fetch('http://localhost:30703/weapon/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function weaponShowUpdate(id) {
    weaponToUpdate = weapons.find(t => t['id'] == id);
    document.getElementById("updatename").value = weaponToUpdate['name'];
    document.getElementById("updatevalue").value = weaponToUpdate['baseDamage'];
    document.getElementById('updateformdiv').style.display = "flex";
}

function weaponCreate() {
    let name = document.getElementById('name').value;
    let value = document.getElementById('value').value;
    fetch('http://localhost:30703/weapon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { name: name, baseDamage: value })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function weaponUpdate() {
    let name = document.getElementById('updatename').value;
    let value = document.getElementById('updatevalue').value;
    fetch('http://localhost:30703/weapon', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { id: armorIdToUpdate, name: name, baseDamage: value })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}
