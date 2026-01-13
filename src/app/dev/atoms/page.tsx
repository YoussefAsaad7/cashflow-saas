"use client";
import AvatarGroup from "@/components/ui/avatar-group";
import BrandLogo from "@/components/ui/brand-logo";
import Button from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import Divider from "@/components/ui/divider";
import InputField from "@/components/ui/input-field";
import SocialAuthButton from "@/components/ui/social-auth-button";
import { ArrowLeft, ArrowRight, UserIcon } from "lucide-react";

export default function AtomsDevPage() {
    return (
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
            <div className="grid grid-cols-3 gap-2">
                <InputField label="Name" icon={UserIcon} />
                <InputField label="Named" />
                <InputField label="Names" error="hi fkoko fkokf " />
                <InputField label="Namea" icon={UserIcon} error="jjfj kf" />
            </div>
            <div className="flex flex-row gap-2">
                <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={false}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                    Sign In
                </Button>
                <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={true}
                    rightIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    Sign In
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    isLoading={false}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    Sign In
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    isLoading={false}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                    Back
                </Button>
                <Button variant="link">
                    Forgot password?
                </Button>
                <Button
                    variant="secondary"
                    type="submit"
                    size="icon"
                    isLoading={false}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                >

                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    isLoading={false}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >

                </Button>
            </div>

            <div className="w-full">
                <Divider label="Or continue with" />
                <Divider className="my-6" />
            </div>
            <div className="flex flex-row gap-10 justify-between">
                <BrandLogo />
                <BrandLogo showText={false} />
                <BrandLogo showText={true} size="lg" />
                <BrandLogo showText={true} size="sm" />
                <BrandLogo showText={true} size="md" />
            </div>
            <div className="flex flex-row gap-2 w-md">
                <SocialAuthButton provider="github" />
                <SocialAuthButton provider="google" />
            </div>

            <div>
                <AvatarGroup avatars={[{id: 1, name: "Youssef"}, {id: 2, name: "Ahmed"}, {id: 3, name: "Ali"}, {id: 4, name: "Omar"}, {id: 5, name: "Mohamed"}]} size="sm" max={3}  />
                <AvatarGroup avatars={[{id: 1, name: "Youssef", src: "https://avatars.githubusercontent.com/u/50503100?v=4"}, {id: 2, name: "Ahmed", src: "https://avatars.githubusercontent.com/u/50503100?v=4"}, {id: 3, name: "Ali", src: "https://avatars.githubusercontent.com/u/50503100?v=4"}, {id: 4, name: "Omar", src: "https://avatars.githubusercontent.com/u/50503100?v=4"}, {id: 5, name: "Mohamed", src: "https://avatars.githubusercontent.com/u/50503100?v=4"}]} size="md" max={3}  />
                <AvatarGroup avatars={[{id: 1, name: "Youssef"}, {id: 2, name: "Ahmed"}, {id: 3, name: "Ali"}, {id: 4, name: "Omar"}, {id: 5, name: "Mohamed"}]} size="md" max={3}  />
            </div>
           
           <div>  <label htmlFor="remember"><Checkbox name="remember" id="remember"/>Remember me</label></div>
        </div>

    );
}