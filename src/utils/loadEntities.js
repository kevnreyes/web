import indexBy from 'index-by';

const hackyNameMap = {
  user: 'users'
};

function getClientEntityName(name) {
  return hackyNameMap[name] || name;
}

export default function loadEntities(response, defaultEntity) {
  const entities = {
    [defaultEntity]: indexBy(response.data, '_id')
  };
  if (response.included) {
    Object.keys(response.included).forEach((type) => {
      const clientType = getClientEntityName(type);
      entities[clientType] = indexBy(response.included[type], '_id');
    });
  }
  return entities;
}

