<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Documentation</h2>
    <ul>
      <li><a href="https://github.com/CodeOfCinders/conquest-server" target="_blank">Github</a></li>
      <li><a href="https://www.gitbook.com/book/aytsukii/conquest-server/welcome" target="_blank">Documentation</a></li>
    </ul>
    <button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Bienvenue sur l\'interface admin du jeu conquest'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
