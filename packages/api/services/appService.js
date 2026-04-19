const stripUserSecrets = (user) => ({
  id: user.id,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  condition: user.condition,
});

const createAppService = ({
  repository,
  tokenService,
  now = () => Date.now(),
}) => ({
  async initialize() {
    await repository.initialize();
  },

  async login(username, password) {
    const users = await repository.getUsers();
    const user = users.find(
      (item) => item.username === username && item.password === password,
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    return {
      token: tokenService.createToken(user.id),
      user: stripUserSecrets(user),
    };
  },

  async register(payload) {
    const users = await repository.getUsers();
    const usernameExists = users.some(
      (item) => item.username.toLowerCase() === payload.username.toLowerCase(),
    );

    if (usernameExists) {
      throw new Error("Username already exists");
    }

    const user = {
      id: `u${now()}`,
      username: payload.username,
      password: payload.password,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      address: payload.address || "",
      condition: payload.condition || "N/A",
    };

    await repository.saveUsers([user, ...users]);

    return {
      token: tokenService.createToken(user.id),
      user: stripUserSecrets(user),
    };
  },

  async getSession(token) {
    const payload = tokenService.verifyToken(token);
    if (!payload) {
      return null;
    }

    const users = await repository.getUsers();
    const user = users.find((item) => item.id === payload.sub);
    if (!user) {
      return null;
    }

    return {
      token,
      user: stripUserSecrets(user),
    };
  },

  getDoctors() {
    return repository.getDoctors();
  },

  getMedicines() {
    return repository.getMedicines();
  },

  async getAppointments(userId) {
    const appointments = await repository.getAppointments();
    return appointments.filter((item) => item.userId === userId);
  },

  async createAppointment(payload) {
    const appointments = await repository.getAppointments();
    const appointment = {
      id: `a${now()}`,
      ...payload,
      status: "Pending",
    };

    await repository.saveAppointments([appointment, ...appointments]);
    return appointment;
  },

  async getProfile(userId) {
    const users = await repository.getUsers();
    const user = users.find((item) => item.id === userId);
    if (!user) {
      throw new Error("Profile not found");
    }

    return stripUserSecrets(user);
  },

  async updateProfile(userId, updates) {
    const users = await repository.getUsers();
    const index = users.findIndex((item) => item.id === userId);
    if (index === -1) {
      throw new Error("Profile not found");
    }

    users[index] = {
      ...users[index],
      ...updates,
    };

    await repository.saveUsers(users);
    return stripUserSecrets(users[index]);
  },

  async getHealthRecords(userId) {
    const prescriptions = await repository.getPrescriptions();
    return prescriptions.filter((item) => item.userId === userId);
  },

  async getOrders(userId) {
    const orders = await repository.getOrders();
    return orders.filter((item) => item.userId === userId);
  },

  async placeOrder(payload) {
    const orders = await repository.getOrders();
    const order = {
      id: `ord${now()}`,
      ...payload,
      status: "Order Placed",
      placedAt: new Date(now()).toISOString(),
      eta: "Tomorrow, 7:00 PM",
    };

    await repository.saveOrders([order, ...orders]);
    return order;
  },
});

module.exports = {
  createAppService,
};
