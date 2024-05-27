# Desafío Soft Jobs

Acá dejé adjunto el Frontend que fue entregado y el Backend que yo hice.

# Cambios

Tuve que cambiar un archivo específicamente del frontend que era "/src/views/Profile.jsx" porque la consulta funcionaba, pero entregaba el error

```js
"Profile.jsx:18 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'data') at Profile.jsx:18:29";
```

Pero al modificar de:

```js
axios
  .get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
  .then(({ data: [user] }) => setDeveloper({ ...user }))
  .catch(({ response: { data } }) => {
    console.error(data);
    window.sessionStorage.removeItem("token");
    setDeveloper(null);
    navigate("/");
  });
```

A

```js
axios
  .get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
  .then(({ data }) => setDeveloper({ ...data }))
  .catch(({ response: { data } }) => {
    console.error(data);
    window.sessionStorage.removeItem("token");
    setDeveloper(null);
    navigate("/");
  });
```

Funciona sin problemas.
