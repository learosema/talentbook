export type Identity = {
  name: string;
  fullName: string;
  role: string;
};

export function createIdentity(
  name: string,
  fullName: string,
  role: string = "user"
): Identity {
  return <Identity>{ name, fullName, role };
}
