let armors = [];
let jobs = [];
let weapons = [];

let connection = null;

let armorIdToUpdate = -1;
let jobIdToUpdate = -1;
let weaponIdToUpdate = -1;

let averageDefenceByJob = -1;
let averageDefence = -1;
let averageDamageByJob = -1;
let averageDamage = -1;
let highestDmgWeaponByGivenRole = "";

let filterJobId = -1;
let filterRoleId = -1;
let filterMinDmg = -1;

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
    document.getElementById("updatejobiddiv").style.display = "inherit";
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
    document.getElementById("filterjobdiv").style.display = "flex";
    document.getElementById("filterrolediv").style.display = "none";
    document.getElementById("filtermindmgdiv").style.display = "none";
    document.getElementById("filterjobbutton").style.display = "none";
    document.getElementById("filterbutton").textContent = "Filter";
    document.getElementById("filterbutton").setAttribute("onclick", "armorShowAllJobArmors()");
    document.getElementById("formjobiddiv").style.display = "flex";
    armorShowAverageDefence();
    armorGetData();
}

function switchToJob() {
    mode = "job";
    document.getElementById('updateformdiv').style.display = "none";
    document.getElementById("updatejobiddiv").style.display = "none";
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
    document.getElementById("filterjobdiv").style.display = "none";
    document.getElementById("filterrolediv").style.display = "flex";
    document.getElementById("filtermindmgdiv").style.display = "flex";
    document.getElementById("filterjobbutton").style.display = "flex";
    document.getElementById("filterbutton").textContent = "Filter Weapons";
    document.getElementById("filterbutton").setAttribute("onclick", "jobShowAllRoleWeapons()");
    document.getElementById("formjobiddiv").style.display = "none";
    jobGetData();
}

function switchToWeapon() {
    mode = "weapon";
    document.getElementById('updateformdiv').style.display = "none";
    document.getElementById("updatejobiddiv").style.display = "inherit";
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
    document.getElementById("filterjobdiv").style.display = "flex";
    document.getElementById("filterrolediv").style.display = "none";
    document.getElementById("filtermindmgdiv").style.display = "none";
    document.getElementById("filterjobbutton").style.display = "none";
    document.getElementById("filterbutton").textContent = "Filter";
    document.getElementById("filterbutton").setAttribute("onclick", "weaponShowAllJobWeapons()");
    document.getElementById("formjobiddiv").style.display = "flex";
    weaponShowAverageDamage();
    weaponGetData();
}

// Armor
// CRUD

async function armorGetData() {
    await fetch('http://localhost:30703/armor')
        .then(x => x.json())
        .then(y => {
            armors = y;
            armorDisplay();
        });
}

function armorDisplay() {
    document.getElementById("valueth").innerHTML = "Defense";
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
            armorShowAverageDefence();
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function armorShowUpdate(id) {
    document.getElementById("updatename").value = armors.find(t => t['id'] == id)['name'];
    document.getElementById("updatevalue").value = armors.find(t => t['id'] == id)['baseDefense'];
    document.getElementById("updatejobid").value = armors.find(t => t['id'] == id)['jobId'];
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
            { name: name, baseDefense: value, jobId: 2 })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            armorShowAverageDefence();
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function armorUpdate() {
    let name = document.getElementById('updatename').value;
    let value = document.getElementById('updatevalue').value;
    let jobId = document.getElementById('updatejobid').value;
    fetch('http://localhost:30703/armor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { id: armorIdToUpdate, name: name, baseDefense: value, jobId: jobId })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            armorShowAverageDefence();
            armorGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

// Non CRUD

async function armorGetAllJobArmors(jobId) {
    await fetch('http://localhost:30703/armor/getalljobarmors/' + jobId)
        .then(x => x.json())
        .then(y => {
            armors = y;
            armorDisplay();
        });
}

async function armorGetAverageDefenceByClass(jobId) {
    await fetch('http://localhost:30703/armor/getaveragedefencebyclass/' + jobId)
        .then(x => x.json())
        .then(y => {
            averageDefenceByJob = y;
        });
}

async function armorGetAverageDefence() {
    await fetch('http://localhost:30703/armor/getaveragedefence')
        .then(x => x.json())
        .then(y => {
            averageDefence = y[0].value;
        });
}

async function armorShowAverageDefence() {
    await armorGetAverageDefence();
    document.getElementById("headerlabel").innerHTML = "Armor Catalog | Average Defence: " + averageDefence;
}

async function armorShowAllJobArmors() {
    let id = document.getElementById("filterjobid").value;
    armorGetAllJobArmors(id);
    await armorGetAverageDefenceByClass(id);
    document.getElementById("headerlabel").innerHTML = "[" + id +"] Armor Catalog | Average Defence: " + averageDefenceByJob;
}

// Job
// CRUD

async function jobGetData() {
    await fetch('http://localhost:30703/job')
        .then(x => x.json())
        .then(y => {
            jobs = y;
            jobDisplay();
        });
}

function jobDisplay() {
    document.getElementById("valueth").innerHTML = "Role";
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

// Non CRUD

async function jobGetAllJobsByRole(roleId) {
    await fetch('http://localhost:30703/job/getalljobsbyrole/' + roleId)
        .then(x => x.json())
        .then(y => {
            jobs = y;
            jobDisplay();
        });
}

async function jobGetAllWeaponByRole(roleId) {
    await fetch('http://localhost:30703/job/getallweaponbyrole/' + roleId)
        .then(x => x.json())
        .then(y => {
            weapons = y;
            weaponDisplay();
        });
}

async function jobGetAllWeaponByRoleMinimumDmg(roleId, minDmg) {
    await fetch('http://localhost:30703/job/getallweaponbyroleminimumdmg/' + roleId + '/' + minDmg)
        .then(x => x.json())
        .then(y => {
            weapons = y;
            weaponDisplay();
        });
}

async function jobGetHighestDMGWeaponGivenRole(roleId) {
    await fetch('http://localhost:30703/job/gethighestdmgweapongivenrole/' + roleId)
        .then(x => x.json())
        .then(y => {
            highestDmgWeaponByGivenRole = y[0];
        });
}

async function jobShowAllRoleWeapons() {
    let roleId = document.getElementById("filterroleid").value;
    let minDmg = document.getElementById("filtermindmg").value;
    if (minDmg > 0) {
        jobGetAllWeaponByRoleMinimumDmg(roleId, minDmg);
    }
    else
    {
        jobGetAllWeaponByRole(roleId);
    }
    await jobGetHighestDMGWeaponGivenRole(roleId);
    document.getElementById("headerlabel").innerHTML = "[" + roleId + "] Job Weapons | Best Weapon: " + highestDmgWeaponByGivenRole.name + " (" + highestDmgWeaponByGivenRole.baseDamage + ")";
}

async function jobShowAllJobsByRole() {
    let roleId = document.getElementById("filterroleid").value;
    jobGetAllJobsByRole(roleId);
    document.getElementById("headerlabel").innerHTML = "[" + roleId + "] Job Catalog";
}

// Weapon
// CRUD

async function weaponGetData() {
    await fetch('http://localhost:30703/weapon')
        .then(x => x.json())
        .then(y => {
            weapons = y;
            weaponDisplay();
        });
}

function weaponDisplay() {
    document.getElementById("valueth").innerHTML = "Damage";
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
            weaponShowAverageDamage();
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function weaponShowUpdate(id) {
    document.getElementById("updatename").value = weapons.find(t => t['id'] == id)['name'];
    document.getElementById("updatevalue").value = weapons.find(t => t['id'] == id)['baseDamage'];
    document.getElementById("updatejobid").value = weapons.find(t => t['id'] == id)['jobId'];
    document.getElementById('updateformdiv').style.display = "flex";
    weaponIdToUpdate = id;
}

function weaponCreate() {
    let name = document.getElementById('name').value;
    let value = document.getElementById('value').value;
    let jobId = document.getElementById('jobId').value;
    fetch('http://localhost:30703/weapon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { name: name, baseDamage: value, jobId: jobId })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            weaponShowAverageDamage();
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

function weaponUpdate() {
    let name = document.getElementById('updatename').value;
    let value = document.getElementById('updatevalue').value;
    let jobId = document.getElementById('updatejobid').value;
    fetch('http://localhost:30703/weapon', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
            { id: weaponIdToUpdate, name: name, baseDamage: value, jobId: jobId })
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            weaponShowAverageDamage();
            weaponGetData();
        })
        .catch((error) => { console.error('Error:', error); });

}

// Non CRUD

async function weaponGetAllJobWeapons(jobId) {
    await fetch('http://localhost:30703/weapon/getalljobweapons/' + jobId)
        .then(x => x.json())
        .then(y => {
            weapons = y;
            weaponDisplay();
        });
}

async function weaponGetAverageDamageByJob(jobId) {
    await fetch('http://localhost:30703/weapon/getaveragedamagebyjob/' + jobId)
        .then(x => x.json())
        .then(y => {
            averageDamageByJob = y;
        });
}

async function weaponGetAverageDamage() {
    await fetch('http://localhost:30703/weapon/getaveragedamage')
        .then(x => x.json())
        .then(y => {
            averageDamage = y[0].value;
        });
}

async function weaponShowAverageDamage() {
    await weaponGetAverageDamage();
    document.getElementById("headerlabel").innerHTML = "Weapon Catalog | Average Damage: " + averageDamage;
}

async function weaponShowAllJobWeapons() {
    let id = document.getElementById("filterjobid").value;
    weaponGetAllJobWeapons(id);
    await weaponGetAverageDefenceByClass(id);
    document.getElementById("headerlabel").innerHTML = "[" + id + "] Weapon Catalog | Average Damage: " + averageDamageByJob;
}
