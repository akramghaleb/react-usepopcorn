export default function ErrorMessage({ message }) {
    return <p className="error">
        <span>⛔</span>
        <strong>{message}</strong>
    </p>
}