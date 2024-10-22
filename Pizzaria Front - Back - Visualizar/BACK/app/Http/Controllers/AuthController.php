namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\TokenRepository;

class AuthController extends Controller
{
    protected $tokenRepository;

    public function __construct(TokenRepository $tokenRepository)
    {
        $this->tokenRepository = $tokenRepository;
    }

    public function login(Request $request)
    {
        $data = $this->validateLogin($request);

        if ($this->attemptLogin($data)) {
            $user = $this->authenticateUser();
            return $this->successResponse($user);
        }

        return $this->errorResponse('Usuário ou senha incorreto', 404);
    }

    public function logout(Request $request)
    {
        $this->revokeUserToken($request);
        return $this->successResponse('Usuário deslogado com sucesso!', 200);
    }

    private function validateLogin($request)
    {
        return $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
    }

    private function attemptLogin($data)
    {
        return Auth::attempt(['email' => strtolower($data['email']), 'password' => $data['password']]);
    }

    private function authenticateUser()
    {
        $user = auth()->user();
        $user->token = $user->createToken($user->email)->accessToken;
        return $user;
    }

    private function revokeUserToken($request)
    {
        $tokenId = $request->user()->token()->id;
        $this->tokenRepository->revokeAccessToken($tokenId);
    }

    private function successResponse($message, $status = 200)
    {
        return [
            'status' => $status,
            'message' => $message,
        ];
    }

    private function errorResponse($message, $status)
    {
        return [
            'status' => $status,
            'message' => $message,
        ];
    }
}
