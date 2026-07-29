import { catchAsync } from "@/lib/helper";
import { resetPassword } from "@/services/auth.service";

export const POST = catchAsync(resetPassword);