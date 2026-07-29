import { catchAsync } from "@/lib/helper";
import { login } from "@/services/auth.service";

export const POST = catchAsync(login);