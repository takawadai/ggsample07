#version 410 core

// 光源
const vec4 lamb   = vec4(0.2, 0.2, 0.2, 1.0);       // 環境光成分の強度
const vec4 ldiff  = vec4(1.0, 1.0, 1.0, 0.0);       // 拡散反射成分の強度
const vec4 lspec  = vec4(1.0, 1.0, 1.0, 0.0);       // 鏡面反射成分の強度

// 材質
const vec4 kamb   = vec4(0.2, 0.4, 0.6, 1.0);       // 環境光の反射係数
const vec4 kdiff  = vec4(0.2, 0.4, 0.6, 1.0);       // 拡散反射係数
const vec4 kspec  = vec4(0.4, 0.4, 0.4, 1.0);       // 鏡面反射係数
const float kshi  = 40.0;                           // 輝き係数

// ラスタライザから受け取る頂点属性の補間値
in vec3 n;                                          // 補間された法線ベクトル
in vec3 l;                                          // 補間された光線ベクトル
in vec3 v;                                          // 補間された視線ベクトル

// フレームバッファに出力するデータ
out vec4 fc;                                        // フラグメントの色

void main(void)
{
  vec3 nn = normalize(n);                           // 法線ベクトル
  vec3 nl = normalize(l);                           // 光線ベクトル
  vec3 nv = normalize(v);                           // 視線ベクトル
  vec3 nr = reflect(nl, nn);                        // 反射ベクトル

  vec3 b = vec3(-n.z, 0.0, n.x);                    // 従接線ベクトル (n × (0, 1, 0))
  vec3 t = normalize(cross(n, b));                  // 接線ベクトル (n × b)

  float rd = dot(nn, nl);
  float rs = dot(nr, nv);

  float cosc = sqrt(1 - dot(nl , t) * dot(nl , t));
  float cosa = max(sqrt(1 - dot(nl , t) *  dot(nl , t)) * sqrt(1 - dot(nv , t) * dot(nv , t)) - dot(nl, t)* dot(nv, t) , 0);
  vec4 iamb = kamb * lamb;
  vec4 idiff = max(rd, 0.0) * kdiff * ldiff;
  vec4 ispec = pow(max(cosa, 0.0), kshi) * kspec * lspec;

  fc = iamb + idiff + ispec;
}
