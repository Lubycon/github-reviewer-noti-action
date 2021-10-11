export interface LubyconUser {
  name: string;
  githubUserName: string;
  email: string;
  role: string | null;
  chapters: string[];
  teams: string[];
}
