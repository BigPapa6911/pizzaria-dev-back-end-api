namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        return $this->successResponse('Usuários encontrados!!', User::select('id', 'name', 'email', 'created_at')->paginate(10));
    }

    public function me()
    {
        return $this->successResponse('Usuário logado!', Auth::user());
    }

    public function store(UserCreateRequest $request)
    {
        $data = $this->validateRequest($request);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        return $this->successResponse('Usuário cadastrado com sucesso!!', $user);
    }

    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('Usuário não encontrado! Que triste!', 404);
        }

        return $this->successResponse('Usuário encontrado com sucesso!!', $user);
    }

    public function update(UserUpdateRequest $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('Usuário não encontrado! Que triste!', 404);
        }

        $user->update($request->all());
        return $this->successResponse('Usuário atualizado com sucesso!!', $user);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('Usuário não encontrado! Que triste!', 404);
        }

        $user->delete();
        return $this->successResponse('Usuário deletado com sucesso!!');
    }

    private function validateRequest($request)
    {
        return $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);
    }

    private function successResponse($message, $data = null)
    {
        return [
            'status' => 200,
            'message' => $message,
            'data' => $data
        ];
    }

    private function errorResponse($message, $status)
    {
        return [
            'status' => $status,
            'message' => $message
        ];
    }
}
