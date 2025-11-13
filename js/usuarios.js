 verificarAutenticacion();
document.addEventListener("DOMContentLoaded", async () => {
  const tablaUsuariosBody = document.querySelector("#tablaUsuarios tbody");

  try {
    const response = await fetch("https://dummyjson.com/users");
    if (response.ok) {
      const data = await response.json();
      const usuarios = data.users;

      usuarios.forEach((u) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${u.firstName} ${u.lastName}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.age}</td>
        <td>${u.role}</td>
        <td>${u.phone}</td>`;
        tablaUsuariosBody.appendChild(fila);
      });
    } else {
      console.log("Error al listar usuarios");
      throw Error("Error al listar usuarios");
    }
  } catch (error) {
    console.log("Error", error);
    throw Error("Error en la api Dummy");

   
  }
});
