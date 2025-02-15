import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Ov23liY5LxNbxM7g95Wd',
      clientSecret: 'd10c494cac3f56ef50f8ce7f7f571433cd773c1f',
    }),
    // GoogleProvider({
    //   clientId: '',
    //   clientSecret: '',
    // }),
  ],
  secret : 'k6oa*7615' //jwt생성시쓰는암호
};
export default NextAuth(authOptions); 