class Env {
  public get isDevelopment() { return process.env.APP_ENV !== 'production'; }
  public get isProduction() { return process.env.APP_ENV === 'production'; }
}

export default new Env();
