let myArray = []; // Define myArray outside of fetchData

function fetchData() {
  fetch(
    "https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      myArray = data; // Store the data in myArray
      updateTable(myArray); // Update the table with the fetched data
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function updateTable(data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows
  data.forEach((student) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${student.id}</td>
            <td class="image-col">
                <div class="image">
                    <img src="${student.img_src}" alt="student-image">
                </div>${student.first_name} ${student.last_name}
            </td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? "Passed" : "Failed"}</td>
            <td>${student.email}</td>`;
    tbody.appendChild(tr);
  });
}

function sortData(column, order) {
  myArray.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];
    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }
  });
  updateTable(myArray); // Update the table with the sorted data
}

function sortName(order) {
  myArray.sort((a, b) => {
    const fullNameA = `${a.first_name} ${a.last_name}`;
    const fullNameB = `${b.first_name} ${b.last_name}`;
    return order === "asc"
      ? fullNameA.localeCompare(fullNameB)
      : fullNameB.localeCompare(fullNameA);
  });
  updateTable(myArray); // Update the table with the sorted data
}

document.getElementById("sortAtoZ").addEventListener("click", () => {
  sortName("asc");
});

document.getElementById("sortZtoA").addEventListener("click", () => {
  sortName("desc");
});
const sortButtons = document.querySelectorAll(".sort-btn");

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.dataset.column;
    const order = button.dataset.order;
    sortData(column, order);
  });
});
document.getElementById("sortPass").addEventListener("click", () => {
  const filteredData = myArray.filter((student) => student.passing); // Filter the array based on passing status

  updateTable(filteredData); // Update the table with the filtered data
});

function genderSort(arr) {
  let set = new Set();
  arr.forEach((student) => {
    set.add(student.gender);
  });
  return set;
}

function genderTables(myArray) {
  const genderSet = genderSort(myArray);
  genderSet.forEach((gender) => {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    thead.innerHTML = `
    <tr>
    <th style="width: 5%; text-align: center;">ID</th>
    <th style="width: 20%;" data-column="first_name last_name">Name</th>
    <th style="width: 10%;" data-column="gender">Gender</th>
    <th style="width: 10%;" data-column="class">Class</th>
    <th style="width: 10%;" data-column="marks">Marks</th>
    <th style="width: 10%;" data-column="passing">Passing</th>
    <th style="width: 25%;">Email</th>
    </tr>
        `;
    table.appendChild(thead);
    let tbody = document.createElement("tbody");
    let filtered_gender = myArray.filter(
      (student) => student.gender === gender
    );
    filtered_gender.forEach((student) => {
      let tr = document.createElement("tr");
      tr.innerHTML = `<td>${student.id}</td>
            <td class="image-col">
                <div class="image">
                    <img src="${student.img_src}" alt="student-image">
                </div>${student.first_name} ${student.last_name}
            </td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? "Passed" : "Failed"}</td>
            <td>${student.email}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    document.querySelector(".table-container").appendChild(table);
  });
}

document.getElementById("sortGender").addEventListener("click", () => {
  document.getElementById("table-1").style.display = "none";
  genderTables(myArray);
});

document.getElementById('search').addEventListener('change', performSearch);
document.getElementById('search-btn').addEventListener('click', performSearch);

function performSearch() {
  let searchTerm = document.getElementById('search').value.toLowerCase();
  let filteredData = myArray.filter((student) => {
    let fullName = `${student.first_name} ${student.last_name}`
    return (
      student.first_name.toLowerCase().includes(searchTerm) ||
      student.last_name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      fullName.toLowerCase().includes(searchTerm)
    );
  });
  updateTable(filteredData); // Update the table with the filtered data
}

fetchData();