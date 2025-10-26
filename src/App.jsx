import React, { useEffect, useState, useMemo } from 'react';
import dadosFaturamento from './dados.json'

// FUNCAO DA TERCEIRA QUESTAO //
function calcularEstatisticasFaturamento(faturamentoDiario) {
    const faturamentosValidos = faturamentoDiario
        .filter(item => item.valor > 0)
        .map(item => item.valor);

    if (faturamentosValidos.length === 0) {
        return { menorValor: '0,00', maiorValor: '0,00', mediaMensal: '0,00', diasAcimaDaMedia: 0 };
    }

    const menorValor = Math.min(...faturamentosValidos);
    const maiorValor = Math.max(...faturamentosValidos);

    const somaTotal = faturamentosValidos.reduce((acc, valor) => acc + valor, 0);
    const mediaMensal = somaTotal / faturamentosValidos.length;

    const diasAcimaDaMedia = faturamentoDiario.filter(item => item.valor > mediaMensal).length;

    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
        menorValor: formatarMoeda(menorValor),
        maiorValor: formatarMoeda(maiorValor),
        mediaMensal: formatarMoeda(mediaMensal),
        mediaMensalNumerica: mediaMensal, 
        diasAcimaDaMedia: diasAcimaDaMedia
    };
}
//

// DADOS E CALCULOS DA QUARTA QUESTAO 
const dadosEstados = [
    { estado: 'SP', valor: 67836.43 },
    { estado: 'RJ', valor: 36678.66 },
    { estado: 'MG', valor: 29229.88 },
    { estado: 'ES', valor: 27165.48 },
    { estado: 'Outros', valor: 19849.53 },
];

const totalMensal = dadosEstados.reduce((acc, e) => acc + e.valor, 0);
const estadosComPercentual = dadosEstados.map((e) => ({
    ...e,
    percentual: ((e.valor / totalMensal) * 100).toFixed(2),
}));
//

// FUNCAO DA QUINTA QUESTAO
const inverterString = (str) => {
    let novaString = '';
    for (let i = str.length - 1; i >= 0; i--) {
        novaString += str[i];
    }
    return novaString;
};
//

function App() {

    // IGNORAR ABAIXO, BOTEI O CSS AQUI MEMO
    const styles = `:root { --cor-primaria: #4f46e5; --cor-primaria-hover: #4338ca; --cor-fundo: #f9fafb; --cor-texto-principal: #1f2937; --cor-texto-secundario: #4b5563; } body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; } .container-principal { padding: 1.5rem; background-color: var(--cor-fundo); min-height: 100vh; } .conteudo-maximo { max-width: 72rem; margin: 0 auto; } .cartao-secao { margin-bottom: 2.5rem; padding: 1.5rem; background-color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-radius: 0.75rem; } .titulo-secao { font-size: 1.5rem; font-weight: 700; color: var(--cor-texto-principal); margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; } .grid-resultados { display: grid; grid-template-columns: 1fr; gap: 1.5rem; max-width: 56rem; margin: 0 auto; } @media (min-width: 768px) { .grid-resultados { grid-template-columns: repeat(2, 1fr); } } @media (min-width: 1024px) { .grid-resultados { grid-template-columns: repeat(4, 1fr); } } .card-resultado { background-color: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border-radius: 0.75rem; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.3s ease; border-bottom: 4px solid var(--cor-primaria); } .card-resultado:hover { transform: scale(1.03); } .card-icon { font-size: 1.875rem; color: var(--cor-primaria); margin-bottom: 0.5rem; } .card-titulo { font-size: 0.875rem; font-weight: 600; color: #6b7280; text-transform: uppercase; } .card-valor { font-size: 1.875rem; font-weight: 700; color: var(--cor-texto-principal); margin-top: 0.25rem; } .tabela-container { background-color: white; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); border-radius: 0.75rem; padding: 1rem; overflow-x: auto; height: 24rem; border: 1px solid #e5e7eb; } .tabela-cabecalho { background-color: #f9fafb; position: sticky; top: 0; z-index: 10; border-bottom: 1px solid #e5e7eb; } .tabela-cabecalho th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; } .tabela-body tr { border-top: 1px solid #e5e7eb; } .tabela-body td { padding: 0.75rem 1rem; white-space: nowrap; font-size: 0.875rem; color: #1f2937; } .tabela-body .linha-acima-media { background-color: #eef2ff; font-weight: 600; } .tabela-body .linha-hover:hover { background-color: #f3f4f6; } .tag { padding: 0.125rem 0.5rem; display: inline-flex; font-size: 0.75rem; line-height: 1.25rem; font-weight: 600; border-radius: 9999px; justify-content: center; align-items: center; min-width: 5.5rem; } .tag-zero { background-color: #fee2e2; color: #b91c1c; } .tag-acima-media { background-color: #d1fae5; color: #065f46; } .tag-abaixo-media { background-color: #fef9c3; color: #92400e; } .bg-solucao { background-color: #38a169; color: white; font-weight: 700; padding: 0.5rem; width: 4rem; text-align: center; border-radius: 0.25rem; } .input-fib { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075); } .input-fib:focus { border-color: var(--cor-primaria); outline: 0; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5); } .btn-fib { background-color: var(--cor-primaria); color: white; font-weight: 700; padding: 0.5rem 1rem; border: none; cursor: pointer; border-radius: 0.5rem; margin-left: 0.75rem; transition: background-color 0.15s ease, box-shadow 0.15s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); } .btn-fib:hover { background-color: var(--cor-primaria-hover); } .bg-sequencia { margin-top: 1rem; font-family: monospace; padding: 0.75rem; background-color: #f3f4f6; border-radius: 0.25rem; color: var(--cor-texto-secundario); } `;
    //

    // SEGUNDA QUESTAO 
    const [n, setN] = useState('');
    const [sequencia, setSequencia] = useState([]);
    
    const Fibonacci = (quantidade) => {
        const fib = [];
        for (let i = 0; i < quantidade; i++) {
            if (i === 0) fib.push(0);
            else if (i === 1) fib.push(1);
            else fib.push(fib[i - 1] + fib[i - 2]);
        }
        return fib;
    };
    
    const gerar = () => {
        const quantidade = parseInt(n);
        if (isNaN(quantidade) || quantidade <= 0) {
            setSequencia(['Digite um número inteiro positivo']);
        } else {
            setSequencia(Fibonacci(quantidade));
        }
    };
    //

    // TERCEIRA QUESTAO //
    const [resultados, setResultados] = useState(null);
    
    const stats = useMemo(() => {
        return calcularEstatisticasFaturamento(dadosFaturamento);
    }, []);
    
    useEffect(() => {
        setResultados(stats);
    }, [stats]);

    useEffect(() => {
        document.title = "Resposta-Teste";
    }, []);
    //

    // QUINTA QUESTAO 
    const stringInicial = 'Target Sistemas';
    const [stringOriginal, setStringOriginal] = useState(stringInicial);
    
    const stringInvertida = useMemo(() => {
        return inverterString(stringOriginal);
    }, [stringOriginal]);

    
    const ResultadoCard = ({ title, value, icon }) => (
        <div className="card-resultado">
            <div className="card-icon">{icon}</div>
            <p className="card-titulo">{title}</p>
            <p className="card-valor">{value}</p>
        </div>
    );

    if (!resultados) {
        return (
            <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
                <p style={{color: '#4f46e5', fontWeight: 500}}>Calculando resultados...</p>
            </div>
        );
    }
    //
    
    const mediaNumerica = resultados.mediaMensalNumerica; //Tabela do detalhamento diario la
    

    return (
        <>
            <style>{styles}</style>
            <div className='container-principal'>
                <div className="conteudo-maximo">
                    
                    {/* QUESTÃO 1 */}
                    <div className='cartao-secao'>
                        <h2 className='titulo-secao'>Primeira Questão: Loop Simples</h2>
                        <p style={{ color: 'var(--cor-texto-secundario)', marginBottom: '1rem', fontSize: '1rem' }}>
                            Observe o trecho de código abaixo: `int INDICE = 13, SOMA = 0, K = 0;` <br />
                            Enquanto K &lt; INDICE faça {'{'} K = K+1; SOMA = SOMA + K {'}'} <br />
                            imprimir(SOMA); Ao final do processamento, qual será o valor da variável SOMA?
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Solução: </h3>
                        <div className="bg-solucao">
                            91
                        </div>
                    </div>

                    {/* QUESTÃO 2 */}
                    <div className='cartao-secao'>
                        <h2 className='titulo-secao'>Segunda Questão: Sequência de Fibonacci</h2>
                        <p style={{ color: 'var(--cor-texto-secundario)', marginBottom: '1rem', fontSize: '1rem' }}>
                            Dado a sequência de Fibonacci, onde se inicia por 0 e 1 e o próximo valor sempre será a soma dos 2 valores anteriores (exemplo: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...),
                            <br /> escreva um programa na linguagem que desejar onde, informado um número, ele calcule a sequência de Fibonacci e retorne uma mensagem avisando
                            <br /> se o número informado pertence ou não a sequência.
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Solução: </h3>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>Digite a quantidade de números da sequência que você deseja (A verificação de pertinência não foi implementada, apenas a geração): </p>

                        <input
                            type="number"
                            value={n}
                            onChange={(e) => setN(e.target.value)}
                            placeholder="Digite a quantidade de números"
                            className='input-fib'
                        />
                        <button
                            className='btn-fib'
                            onClick={gerar}
                        >
                            Gerar Sequencia
                        </button>

                        {sequencia.length > 0 && (
                            <p className='bg-sequencia'>
                                <span style={{ fontWeight: 600, color: '#374151' }}>Sequência:</span> {sequencia.join(', ')}
                            </p>
                        )}
                    </div>


                    {/* QUESTÃO 3 */}
                    <div className='cartao-secao'>
                        <h2 className='titulo-secao'>Terceira Questão: Análise de Faturamento</h2>
                        <p style={{ color: 'var(--cor-texto-secundario)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                            Dado um vetor que guarda o valor de faturamento diário de uma distribuidora, faça um programa...
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>Solução: </h3>

                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem', borderBottom: '2px solid var(--cor-primaria)', display: 'inline-block', padding: '0 1rem 0.25rem' }}>
                                Estatísticas Mensais
                            </h1>
                            <p style={{ color: '#4b5563' }}>
                                Análise de desempenho da distribuidora (Ignorando faturamento R$ 0,00).
                            </p>
                        </div>

                        <div className="grid-resultados">
                            <ResultadoCard
                                title="Menor Faturamento"
                                value={`R$ ${resultados.menorValor}`}
                                icon="📉"
                            />
                            <ResultadoCard
                                title="Maior Faturamento"
                                value={`R$ ${resultados.maiorValor}`}
                                icon="📈"
                            />
                            <ResultadoCard
                                title="Média Mensal"
                                value={`R$ ${resultados.mediaMensal}`}
                                icon="📊"
                            />
                            <ResultadoCard
                                title="Dias Acima da Média"
                                value={resultados.diasAcimaDaMedia}
                                icon="🗓️"
                            />
                        </div>
                        <h4 className='titulo-secao' style={{ fontSize: '1.125rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: 'none' }}>
                            Detalhamento Diário do Faturamento
                        </h4>
                        <div className="tabela-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className="tabela-cabecalho">
                                    <tr>
                                        <th style={{ width: '15%' }}>Dia</th>
                                        <th style={{ width: '45%', textAlign: 'right' }}>Valor (R$)</th>
                                        <th style={{ width: '40%' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="tabela-body">
                                    {dadosFaturamento.map((item) => (
                                        <tr
                                            key={item.dia}
                                            className={item.valor > mediaNumerica ? 'linha-acima-media' : 'linha-hover'}
                                        >
                                            <td>{item.dia}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                {`R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            </td>
                                            <td>
                                                {item.valor === 0.0 ? (
                                                    <span className="tag tag-zero">Zero</span>
                                                ) : item.valor > mediaNumerica ? (
                                                    <span className="tag tag-acima-media">Acima da Média</span>
                                                ) : (
                                                    <span className="tag tag-abaixo-media">Abaixo/Igual Média</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QUESTÃO 4 */}
                    <div className='cartao-secao'>
                        <h2 className='titulo-secao'>Quarta Questão: Faturamento por estado</h2>
                        <p style={{ color: 'var(--cor-texto-secundario)', marginBottom: '1rem', fontSize: '1rem' }}>
                            Dado o valor de faturamento mensal de uma distribuidora, detalhado por estado: <br />
                            • SP – R$67.836,43 <br/>
                            • RJ – R$36.678,66 <br/>
                            • MG – R$29.229,88 <br/>
                            • ES – R$27.165,48 <br/>
                            • Outros – R$19.849,53 <br/>
                            Escreva um programa na linguagem que desejar onde calcule o percentual de representação que cada estado teve dentro do valor total mensal da distribuidora.
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Solução: </h3>
                        
                        <p style={{ color: 'var(--cor-texto-principal)', marginBottom: '0.75rem', fontWeight: 600 }}>
                            Faturamento Total Mensal: R$ {totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>

                        <div className="tabela-container" style={{ height: 'auto', maxHeight: '20rem', padding: '0.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className="tabela-cabecalho">
                                    <tr>
                                        <th style={{ width: '30%' }}>Estado</th>
                                        <th style={{ width: '40%', textAlign: 'right' }}>Faturamento (R$)</th>
                                        <th style={{ width: '30%', textAlign: 'right' }}>% Representação</th>
                                    </tr>
                                </thead>
                                <tbody className="tabela-body">
                                    {estadosComPercentual.map((item, index) => (
                                        <tr key={item.estado} className="linha-hover">
                                            <td>{item.estado}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                {`R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--cor-primaria)' }}>
                                                {`${item.percentual}%`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QUESTÃO 5 */}
                    <div className='cartao-secao'>
                        <h2 className='titulo-secao'>Quinta Questão: Inverter String</h2>
                        <p style={{ color: 'var(--cor-texto-secundario)', marginBottom: '1rem', fontSize: '1rem' }}>
                            Escreva um programa que inverta os caracteres de um string. <br />
                            IMPORTANTE: <br/>
                            a) Essa string pode ser informada através de qualquer entrada de sua preferência ou pode ser previamente definida no código; <br/>
                            b) Evite usar funções prontas, como, por exemplo, reverse; <br/>
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Solução: </h3>

                        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
                            A string original é: "{stringInicial}". Edite a caixa de texto abaixo:
                        </p>
                        
                        <input
                            type="text"
                            value={stringOriginal}
                            onChange={(e) => setStringOriginal(e.target.value)}
                            placeholder=""
                            className='input-fib'
                            style={{ width: '100%', maxWidth: '300px' }}
                        />

                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '1.125rem' }}>
                            <p style={{ color: '#1f2937', fontWeight: 500 }}>
                                Original: <span style={{ color: 'var(--cor-primaria)', fontWeight: 600 }}>{stringOriginal}</span>
                            </p>
                            <p style={{ color: '#1f2937', fontWeight: 500 }}>
                                Invertida: <span style={{ color: '#ef4444', fontWeight: 600 }}>{stringInvertida}</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default App;
