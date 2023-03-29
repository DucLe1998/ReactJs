export const key = 'camAiServerInformation';
export const SERVER_TYPE = [
  { id: 'MINIO', name: 'Minio', color: 'blue' },
  { id: 'KAFKA', name: 'Kafka', color: 'yellow' },
  { id: 'MQTT', name: 'MQTT', color: 'green' },
  // { id: 'CLOUD_ENGINE', name: 'Cloud Engine', color: 'red' },
];
export const SERVER_TYPE_MAP = SERVER_TYPE.reduce(
  (total, cur) => ({ ...total, [cur.id]: cur }),
  {},
);
export const DEFAULT_FILTER = {
  // limit: 25,
  // page: 1,
  type: '',
};
