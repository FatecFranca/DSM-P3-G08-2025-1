/*
  Função que processa a query string da URL da requisição
  e verifica se o parâmetro "include" foi passado. Em caso
  positivo, preenche um objeto com os relacionamentos que
  devem ser incluídos na consulta sendo executada
*/
function includeRelations(query, validRelations = []) {
  const include = {};

  if (query.include) {
    const relations = query.include.split(',').map(rel => rel.trim());

    for (let rel of relations) {
      if (rel.includes('.')) {
        const [parent, child] = rel.split('.');

        if (!validRelations.includes(parent)) continue;

        if (!include[parent]) {
          include[parent] = { include: {} };
        }

        include[parent].include[child] = true;
      } else {
        if (validRelations.includes(rel)) {
          include[rel] = true;
        }
      }
    }
  }

  return include;
}

export { includeRelations };