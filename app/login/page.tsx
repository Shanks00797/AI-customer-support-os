import { useSession } from "next-auth/react"

export default function Login() {
    const session = useSession()
    if (session.status === "authenticated") {
        return (
            <div>This is a login page...</div>
        )
    } else {
        return (
            <div>Unauthenticated</div>
        )
    }
}