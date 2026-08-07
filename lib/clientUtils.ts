import { toast } from "sonner";

export const countries = ["Argentina","Australia","Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Denmark","Egypt","England","France","Germany","Ghana","Greece","India","Indonesia","Iran","Ireland","Italy","Japan","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Paraguay","Peru","Poland","Portugal","Qatar","Saudi Arabia","Scotland","Senegal","Serbia","South Africa","South Korea","Spain","Sweden","Switzerland","Turkey","Ukraine","United Arab Emirates","United States","Uruguay","Wales","Zimbabwe"];

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

export const scrollToComponent = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'center'});
}

export const sendMessage = (status: boolean, message: string) => {
  if(status)
    toast.success(message);
  else 
    toast.error(message);
}

export const formatTime = (time: number) => {
  if(time === 0) return '00:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  return `${minutes}`.padStart(2, "0") + ":" + `${seconds}`.padStart(2, "0");
};