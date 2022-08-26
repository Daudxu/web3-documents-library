export const getMetadata = async (url) => {
    const fetcher = async (...args) => fetch(...args).then((res) => res.json());
    return  await fetcher(url);
}
