export type Identity = {
  name: string;
  fullName: string;
};

export function createIdentity(name: string, fullName: string): Identity {
  return <Identity>{name, fullName};
}