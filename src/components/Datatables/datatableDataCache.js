import { formatData, revalidateQueryData } from "./dataHandler";

const rawDataCache = {
  data: null,
  promise: null,
  tokenKey: null,
};

const formattedDataCache = new Map();

function cloneRows(rows = []) {
  return rows.map((row) => ({ ...row }));
}

function cloneColumns(columns = []) {
  return columns.map((column) => ({ ...column }));
}

function cloneFlags(items = []) {
  return items.map((item) => ({ ...item }));
}

function cloneSnapshot(snapshot) {
  return {
    dataQuery: cloneRows(snapshot.dataQuery),
    tableData: cloneRows(snapshot.tableData),
    defColumns: cloneColumns(snapshot.defColumns),
    defColumnsOut: cloneColumns(snapshot.defColumnsOut),
    restorations: cloneFlags(snapshot.restorations),
    researchs: cloneFlags(snapshot.researchs),
  };
}

async function getRawData(accessToken, refreshToken) {
  const tokenKey = `${accessToken ?? ""}:${refreshToken ?? ""}`;

  if (rawDataCache.tokenKey !== tokenKey) {
    rawDataCache.data = null;
    rawDataCache.promise = null;
    rawDataCache.tokenKey = tokenKey;
    formattedDataCache.clear();
  }

  if (!rawDataCache.promise) {
    rawDataCache.promise = revalidateQueryData(
      accessToken,
      refreshToken,
      rawDataCache.data,
    )
      .then((result) => {
        const nextData = Array.isArray(result.data) ? result.data : [];
        const shouldRefreshSnapshots =
          result.source === "network" ||
          (result.source === "disk" && rawDataCache.data === null);

        rawDataCache.data = nextData;

        if (shouldRefreshSnapshots) {
          formattedDataCache.clear();
        }

        return {
          data: rawDataCache.data,
          shouldRefreshSnapshots,
        };
      })
      .finally(() => {
        rawDataCache.promise = null;
      });
  }

  const result = await rawDataCache.promise;

  return {
    data: cloneRows(result.data),
    shouldRefreshSnapshots: result.shouldRefreshSnapshots,
  };
}

export async function loadDatatableSnapshot({
  accessToken,
  refreshToken,
  module,
  size,
}) {
  const cacheKey = `${module}:${size}`;
  const rawData = await getRawData(accessToken, refreshToken);
  const cachedSnapshot = formattedDataCache.get(cacheKey);

  if (cachedSnapshot && !rawData.shouldRefreshSnapshots) {
    return cloneSnapshot(cachedSnapshot);
  }

  const formattedData = formatData(rawData.data, size, module, true, null, null);
  const snapshot = {
    dataQuery: rawData.data,
    tableData: formattedData[0],
    defColumns: formattedData[1],
    defColumnsOut: formattedData[2] ?? [],
    restorations: formattedData[3] ?? [],
    researchs: formattedData[4] ?? [],
  };

  formattedDataCache.set(cacheKey, cloneSnapshot(snapshot));

  return cloneSnapshot(snapshot);
}

export function invalidateDatatableCache() {
  rawDataCache.data = null;
  rawDataCache.promise = null;
  rawDataCache.tokenKey = null;
  formattedDataCache.clear();
}
