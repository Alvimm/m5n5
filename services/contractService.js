class Repository {
    execute(query) {
      return [];
    }
  }
  
  function getContracts(empresa, inicio) {
    const repository = new Repository();
    const query = `Select * from contracts Where empresa = '${empresa}' And data_inicio = '${inicio}'`;
    return repository.execute(query);
  }
  
  module.exports = { getContracts };