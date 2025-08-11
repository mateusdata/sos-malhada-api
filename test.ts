import axios from 'axios';

const BASE_URL = 'https://floodapi.mateusdata.com.br/users';

async function main() {
  let ciclo = 1;



  while (true) {
    console.log(`### Ciclo ${ciclo} ###`);
    const INTERVALO_MS = Math.floor(Math.random() * (30500 - 100 + 1)) + 100;;

    try {
      // 1) Buscar usuários atuaiss
      const getUsersResp = await axios.get(BASE_URL);
      const users = getUsersResp.data;
      console.log(`GET /users - encontrou ${users.length} usuários`);
      console.log("intervalo", INTERVALO_MS, "ms");

      // 2) Criar usuário
      const deviceToken = `token_${Math.floor(Math.random() * 100000)}`;
      console.log(`POST /users - criando usuário com deviceToken: ${deviceToken}`);

      const postResp = await axios.post(BASE_URL, { deviceToken });
      const userId = postResp.data.id;
      console.log(`Usuário criado com ID: ${userId}`);

      // 3) Atualizar usuário criado
      const updatedToken = `${deviceToken}_updated`;
      console.log(`PATCH /users/${userId} - atualizando deviceToken para: ${updatedToken}`);

      await axios.patch(`${BASE_URL}/${userId}`, { deviceToken: updatedToken });
      console.log('Usuário atualizado');

      // 4) Buscar todos usuários atualizados
      const allUsersResp = await axios.get(BASE_URL);
      console.log(`GET /users - total de usuários agora: ${allUsersResp.data.length}`);

    } catch (error) {
      console.error('Erro durante o ciclo:', error);
    }

    console.log('-----------------------------');

    ciclo++;

    // Intervalo de 2 horas entre ciclos
    await new Promise(res => setTimeout(res, INTERVALO_MS));
  }
}

main();
