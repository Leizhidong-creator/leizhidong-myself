import { ref } from "vue";

export function createProjectLoader<T>(loadProject: (projectId: string) => Promise<T> | T) {
  const current = ref<T | null>(null);
  let requestId = 0;

  const load = async (projectId: string) => {
    const id = ++requestId;
    current.value = null;

    let result: T;
    try {
      result = await loadProject(projectId);
    } catch (error) {
      if (id !== requestId) return null;
      throw error;
    }
    if (id !== requestId) return null;

    current.value = result;
    return result;
  };

  const cancel = () => {
    requestId += 1;
    current.value = null;
  };

  return { current, load, cancel };
}
