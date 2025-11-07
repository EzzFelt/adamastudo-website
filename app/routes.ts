import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  

  route("service", "routes/service.tsx"),
  route("service/:id", "routes/service-detail.tsx"),        
  route("service/:id/hire", "routes/service-hire.tsx"),      
  route("service/add", "routes/service-add.tsx"),            
  
  route("my-services", "routes/my-services.tsx"),

  route("cronogram", "routes/cronogram.tsx"),
  route("history", "routes/history.tsx"),
] satisfies RouteConfig;