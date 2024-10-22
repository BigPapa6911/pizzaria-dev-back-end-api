namespace App\Http\Controllers;

use App\Models\Flavor;
use App\Http\Requests\FlavorCreatRequest;
use App\Http\Enums\TamanhoEnum;
use Illuminate\Http\Request;

class FlavorController extends Controller
{
    public function index()
    {
        return $this->successResponse(
            'Sabores encontrados!!',
            Flavor::select('id', 'sabor', 'preco', 'tamanho')->paginate(10)
        );
    }

    public function store(FlavorCreatRequest $request)
    {
        $data = $this->validateRequest($request);

        $flavor = Flavor::create([
            'sabor' => $data['sabor'],
            'preco' => $data['preco'],
            'tamanho' => TamanhoEnum::from($data['tamanho']),
        ]);

        return $this->successResponse('Sabor cadastrado com sucesso!!', $flavor);
    }

    public function show(string $id)
    {
        $flavor = Flavor::find($id);

        if (!$flavor) {
            return $this->errorResponse('Sabor não encontrado! Que triste!', 404);
        }

        return $this->successResponse('Sabor encontrado com sucesso!!', $flavor);
    }

    public function update(Request $request, string $id)
    {
        $flavor = Flavor::find($id);

        if (!$flavor) {
            return $this->errorResponse('Sabor não encontrado! Que triste!', 404);
        }

        $flavor->update($request->all());
        return $this->successResponse('Sabor atualizado com sucesso!!', $flavor);
    }

    public function destroy(string $id)
    {
        $flavor = Flavor::find($id);

        if (!$flavor) {
            return $this->errorResponse('Sabor não encontrado! Que triste!', 404);
        }

        $flavor->delete();
        return $this->successResponse('Sabor deletado com sucesso!!');
    }

    private function validateRequest($request)
    {
        return $request->validate([
            'sabor' => 'required|string',
            'preco' => 'required|numeric',
            'tamanho' => 'required|in:small,medium,large',
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
