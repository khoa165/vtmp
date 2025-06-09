import type { CommandStartedEvent } from 'mongodb';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const writtenCollections = new Set<string>();
let mongoAlreadyStarted = false;

export const useMongoDB = async () => {
  before(async function () {
    if (mongoAlreadyStarted) {
      return;
    }
    mongoAlreadyStarted = true;
    this.timeout(600000);
    await startMongoDB();
  });

  beforeEach(async function () {
    if (writtenCollections.size > 0) {
      await clearMongoDBCollections();
    }
    writtenCollections.clear();
  });
};

let cachedMongoReplicaSet: MongoMemoryReplSet | undefined;
export const startMongoDB = async () => {
  const dbExistsAndRunning =
    cachedMongoReplicaSet != null && cachedMongoReplicaSet.state === 'running';
  if (!dbExistsAndRunning) {
    cachedMongoReplicaSet = await MongoMemoryReplSet.create({
      replSet: {
        count: 1,
        dbName: 'vtmp-test',
      },
    });
    const uri = cachedMongoReplicaSet.getUri('vtmp');
    await Promise.all([
      mongoose.connect(uri, {
        monitorCommands: true,
      }),
    ]);
    mongoose.connection
      .getClient()
      .on('commandStarted', processDBCommandStartedEvent);
    await createUniqueIndexes(mongoose.connection);
  }
};

const processDBCommandStartedEvent = (event: CommandStartedEvent) => {
  const collectons = getCollectionsWrittenToByCommand(event);
  collectons.forEach((collection) => {
    writtenCollections.add(collection);
  });
};

const writeCommandNames = new Set(['insert', 'update', 'findAndModify']);
const getCollectionsWrittenToByCommand = (event: CommandStartedEvent) => {
  if (writeCommandNames.has(event.commandName)) {
    return [event.command[event.commandName]];
  }
  return [];
};

const createUniqueIndexes = async (connection: mongoose.Connection) => {
  const modelsByBaseName = getModelsWithUniqueIndexes(connection);
  await Promise.all(
    Object.keys(modelsByBaseName).map(async (modelName) => {
      const models = modelsByBaseName.get(modelName);
      if (models == null) {
        return;
      }
      for (const model of models) {
        await model.createIndexes();
      }
    })
  );
};

const getModelsWithUniqueIndexes = (connection: mongoose.Connection) => {
  const modelsByBaseName = new Map<string, mongoose.Model<unknown>[]>();
  for (const m of Object.values(connection.models)) {
    const indexes = m.schema.indexes();
    const containesUniqueIndex = indexes.some((index) => index[1].unique);
    if (!containesUniqueIndex) {
      continue;
    }
    const baseName = m.baseModelName ?? m.modelName;
    if (!modelsByBaseName.has(baseName)) {
      modelsByBaseName.set(baseName, []);
    }
    modelsByBaseName.get(baseName)?.push(m);
  }
  return modelsByBaseName;
};

const clearMongoDBCollections = async () => {
  const collections = (await mongoose.connection.db?.collections()) ?? [];
  await Promise.all(
    collections.map(async (collection) => {
      if (collection.namespace.startsWith('system')) {
        return;
      }
      if (!writtenCollections.has(collection.collectionName)) {
        return;
      }
      try {
        await collection.deleteMany({});
      } catch (error) {
        if (error instanceof Error && error.name !== 'MongoServerError') {
          throw error;
        }
      }
    })
  );
};

export const stopMongoDB = async () => {
  for (const connection of mongoose.connections) {
    await connection.close();
  }
};
