import axios, { AxiosInstance } from 'axios';
import { secrets } from "./secrets";
import toast from "react-hot-toast";

export interface User {
  id?: number;
  user_id?: number; // Backend sometimes uses user_id
  user_name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  password?: string;
  token?: string;
  profile_picture?: string;
}

export interface Event {
  event_id?: number;
  event_name: string;
  description: string;
  start_date_time: string;
  image_url?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem("token");

    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (this.token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    }
  }

  
  setToken(token: string) {
    this.token = token;

    localStorage.setItem("token", token);

    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // --------- AUTH ---------
  
  async register(fullName: string, email: string, phone: string, password: string, profilePictureBase64?: string) {

  try {

    const response = await this.client.post("/api/register", {
      user_name: fullName,
      email,
      phone,
      password_hash: password,
      profile_picture: profilePictureBase64
    });

    return response.data;

  } catch (error) {

    this.handleError(error);
    throw error;

  }

}


 async login(email: string, password: string): Promise<User | undefined> {
  try {

    const response = await this.client.post("/api/login", { email, password });

    const token = response.data.token;

    if (token) {
      this.setToken(token);
    }

    toast.success("Login successful");

    return response.data;

  } catch (error) {
    this.handleError(error);
  }
 }

  async logout() {
    try {
      const response = await this.client.post("/api/logout");

      this.token = null;

      localStorage.removeItem("token");

      delete this.client.defaults.headers.common["Authorization"];

      toast.success("Logged out successfully");

      return response.data;

    } catch (error) {
      this.handleError(error);
    }
  }

  // --------- USER ---------

  async getProfile(): Promise<User | undefined> {
    try {
      const response = await this.client.get("/api/profile");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    try {
      const response = await this.client.put(`/api/users/${id}`, data);
      toast.success("Profile updated successfully");
      return response.data.user;
    } catch (error) {
      this.handleError(error);
    }
  }

  // --------- EVENTS ---------

  async getEvents(): Promise<Event[] | undefined> {
    try {
      const response = await this.client.get("/api/events");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMyEvents(): Promise<{ hosting: Event[], attending: Event[] } | undefined> {
    try {
      const response = await this.client.get("/api/my-events");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEvent(id: number): Promise<Event | undefined> {
    try {
      const response = await this.client.get(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createEvent(event_name: string, description: string, start_date_time: string, venue: string, category: string, price: number | string, image_base64?: string) {
    try {
      const response = await this.client.post("/api/events", {
        event_name,
        description,
        start_date_time,
        venue,
        category,
        price,
        image_base64: image_base64 || null
      });

      toast.success("Event created successfully");

      return response.data;

    } catch (error) {
      this.handleError(error);
    }
  }

  // --------- SESSIONS & ATTENDANCE ---------

  async createSession(sessionName: string, duration: number, username?: string, password?: string) {
    try {
      const response = await this.client.post("/api/sessions", { sessionName, duration, username, password });
      toast.success("Session created successfully");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSession() {
    try {
      const response = await this.client.get("/api/sessions/current");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async viewSessions(username?: string, password?: string) {
    try {
      const response = await this.client.post("/api/sessions/view", { username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSession(sessionId: number, isActive: boolean, username?: string, password?: string) {
    try {
      const response = await this.client.put(`/api/sessions/${sessionId}`, { isActive, username, password });
      toast.success("Session updated successfully");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async submitAttendance(roll: number) {
    try {
      const response = await this.client.post("/api/attendance", { roll });
      toast.success("Attendance submitted");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
 // --------- ERROR HANDLING ---------

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as { message?: string; error?: string };
        const message = data.message || data.error || "Server error";

        console.error("API Error:", message);
        toast.error(message);
      } else if (error.request) {
        console.error("No response from server", error.request);
        toast.error("Server not responding. Check Laravel server.");
      }
    } else if (error instanceof Error) {
      console.error("Request Error:", error.message);
      toast.error(error.message);
    } else {
      console.error("Unknown Error:", error);
      toast.error("An unexpected error occurred.");
    }
  }

 // --------- AI CHATBOT ---------
  
  // sending user text to our laravel backend which then talks to gemini
  async chatWithAI(message: string): Promise<{ reply: string } | undefined> {
    try {
      const response = await this.client.post("/api/chat", { message });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // --------- AI EVENT GENERATOR ---------
  
  async generateEvent(keywords: string): Promise<{ title: string, description: string, tags: string } | undefined> {
    try {
      const response = await this.client.post("/api/generate-event", { keywords });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default ApiClient;