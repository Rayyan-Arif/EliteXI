import { catchAsync } from "@/lib/helper";
import { forgotPassword } from "@/services/auth.service";

export const POST = catchAsync(forgotPassword);