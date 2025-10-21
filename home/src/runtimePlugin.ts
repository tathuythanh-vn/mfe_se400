const runtimePlugin = function () {
  return {
    name: 'optional-remotes-plugin',
    errorLoadRemote(args: any) {
      const { id, error, from } = args;
      console.warn(`Failed to load remote ${id} from ${from}:`, error);

      // Return a fallback component for failed remote loads
      return {
        __esModule: true,
        default: () => {
          return null; // or a fallback component
        },
      };
    },
  };
};

export default runtimePlugin;
