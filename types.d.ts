interface User {
  email: string;
  id: string;
  password: string;
  role: string[];
}

interface UserInput {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface UserWithoutPassword {
  email: string;
  id: string;
  role: string[];
}
